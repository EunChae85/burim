import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';
import openai from '@/lib/openai';
import { format } from 'date-fns';

const parser = new Parser({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
});

const RSS_URLS = [
    'http://www.molit.go.kr/dev/board/board_rss.jsp?rss_id=NEWS',
    'https://www.mk.co.kr/rss/50300009/',
    'http://news.suwon.go.kr/openAPI/?CG=AL',
    'https://gnews.gg.go.kr/news/news_rss.do',
];

const TOPIC_KEYWORDS = ["아파트", "전세", "월세", "공급", "분양", "집값", "대출", "금리", "임대", "정부", "정책", "시장", "국토부", "세금", "규제", "실거래"];
const EXCLUDE_KEYWORDS = ["복지", "캠페인", "행사", "축제", "문화", "예술", "지원금", "모집", "대회", "공연", "전시"];

interface RSSItem extends Parser.Item {
    sourceName: string;
    summary?: string;
    description?: string;
}

export async function GET() {
    try {
        console.log("Starting Premium Real Estate News Fetch...");

        const todayStrPrefix = format(new Date(), 'yyyyMMdd');
        const todayCount = await prisma.news.count({
            where: {
                slug: {
                    startsWith: `news-${todayStrPrefix}`
                }
            }
        });

        if (todayCount >= 5) {
            return NextResponse.json({ message: "샘플 생성 최대 5건의 뉴스가 이미 발행되었습니다." });
        }

        const feeds = await Promise.all(
            RSS_URLS.map(async (url) => {
                try {
                    return await parser.parseURL(url);
                } catch (err: any) {
                    console.error(`RSS Error (${url}):`, err.message);
                    return null;
                }
            })
        );

        const allItems: RSSItem[] = feeds.flatMap(feed => (feed?.items || []).map(item => ({
            ...item,
            sourceName: feed?.title || "RSS Source"
        })));

        if (allItems.length === 0) return NextResponse.json({ error: "RSS Unavailable" }, { status: 503 });

        const topicFiltered = allItems.filter(item => {
            const content = (item.title + (item.contentSnippet || item.summary || item.description || "")).toLowerCase();
            const hasTopic = TOPIC_KEYWORDS.some(kw => content.includes(kw));
            const hasExclude = EXCLUDE_KEYWORDS.some(kw => content.includes(kw));
            return hasTopic && !hasExclude;
        });

        const sortByDate = (a: RSSItem, b: RSSItem) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime();
        topicFiltered.sort(sortByDate);

        let successCount = 0;
        let processedCount = 0;
        const targetCount = 5 - todayCount;

        for (const item of topicFiltered) {
            if (successCount >= targetCount) break;

            const existing = await prisma.news.findFirst({
                where: {
                    OR: [
                        { sourceUrl: item.link || "" },
                        { title: item.title || "" }
                    ]
                }
            });

            if (!existing) {
                const content = (item.title + (item.contentSnippet || item.summary || item.description || "")).toLowerCase();
                const isLocal = ["수원", "매교", "세류", "권선", "팔달"].some(kw => content.includes(kw));
                const selectedType = isLocal ? 'LOCAL' : 'NATIONAL';

                console.log(`Analyzing premium item candidate: ${item.title}`);

                const result = await processAI(item, selectedType, todayStrPrefix);

                if (result) {
                    successCount++;
                } else {
                    processedCount++;
                }
            }
        }

        if (successCount > 0) {
            return NextResponse.json({
                message: `최상급 퀄리티의 리포트 ${successCount}건이 성공적으로 발행되었습니다. (사전 거절된 기사 수: ${processedCount}건)`,
                count: successCount
            });
        } else {
            return NextResponse.json({
                message: "후보 기사들이 모두 엄격한 AI 품질 조건을 통과하지 못해 추가로 발행된 뉴스가 없습니다."
            });
        }

    } catch (error: any) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function processAI(item: RSSItem, type: 'LOCAL' | 'NATIONAL', todayStrPrefix: string) {
    try {
        const prompt = `당신은 수원 지역 전문 최고급 부동산 애널리스트입니다. 
다음 기사를 분석하여 '반드시' 아래의 포맷으로만 응답하라.

[기사 제목]: ${item.title}
[기사 내용]: ${item.contentSnippet || item.summary || item.description || item.title}

[엄격한 생성 조건]
기사를 다음 3단계 중 하나로 분류하라:
1. STRONG: 기사가 가격, 거래량, 공급, 세금, 대출, 개발, 금리와 직접 연결됨.
2. WEAK: 정책/시장 변화가 간접적으로는 연결 가능함.
3. REJECT: 아예 상관없는 사회성 기사, 단순 가십, 복지 캠페인, 지역 행사 등.

'REJECT'인 경우 내용 생성 없이 단 한 줄 "REJECT: 기준 미달" 이라고만 출력하고 종료할 것.
'STRONG'과 'WEAK'는 아래 포맷에 맞추어 생성하되, 
분류가 'WEAK'인 경우는 "수원에 미치는 영향이 제한적"임을 내용 중에 명확히 표현할 것.
기사에 없는 수치를 절대 임의로 생성/추측하지 말 것.
출력 내용 어디에도 '매교' 또는 '세류'라는 단어를 절대 사용하지 말고, 오직 '수원'으로 통합할 것.
각 섹션(##) 사이에는 반드시 두 줄(엔터 2번)을 띄워서 섹션 간격이 시각적으로 벌어지게 할 것.

[출력 포맷 - 마크다운 필수 적용]

제목: 기사의 핵심을 담은 제목 (주의: 반드시 '수원'이라는 키워드를 제목에 자연스럽게 포함할 것. 단, '수원 영향분석:', '수원 부동산 시장의 변화:' 같은 반복적인 접두어는 절대 붙이지 말고, 대괄호 [ ] 도 넣지 말 것)
분류: [STRONG 또는 WEAK]
연관도: [1~10]

내용:
## 📊 핵심 요약
- [정책/이슈 핵심 요약 1줄]
- [전국 흐름 변화 1줄]
- [수원 지역 영향 1줄 종합]


## 🏦 전국 시장 변화
(기사의 정책/금리/공급 변화에 대한 핵심 설명. 기사에 언급된 수치 기반으로 작성)


## 📍 수원 영향 분석
- **단기 영향**: [분석]
- **중기/장기 영향**: [분석]
- **실수요 vs 투자수요**: [실수요자와 투자자 관점 구분하여 분석]


## 👀 현장 체감 코멘트
[부동산 현장 전문가 시점의 코멘트 한 줄. 예: 현재 수원 소형 아파트 전세 문의는 보합세를 유지하고 있습니다.]


## 📌 상담 안내
최근 수원 지역 실거래 흐름 및 상세한 시세 변화가 궁금하시다면 언제든 전문가 상담이 가능합니다.
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
        });

        const aiResult = response.choices[0].message.content || "";

        if (aiResult.includes("REJECT") || aiResult.includes("기준 미달")) {
            console.log(`[분석 거절됨 - 품질 조건 미달]: ${item.title}`);
            return false;
        }

        const aiTitle = aiResult.match(/제목: (.*)/)?.[1] || item.title || "Untitled News";
        const relevanceScore = parseInt(aiResult.match(/연관도: (.*)/)?.[1]?.replace(/[^0-9]/g, "") || "5");

        const contentMatch = aiResult.match(/내용:([\s\S]*)/);
        let aiContent = contentMatch ? contentMatch[1].trim() : aiResult;

        aiContent = aiContent.replace(/^제목?:?.*\n?/gm, '')
            .replace(/^분류?:?.*\n?/gm, '')
            .replace(/^연관도?:?.*\n?/gm, '')
            .replace(/^내용?:?\n?/gm, '').trim();

        const slug = `news-${todayStrPrefix}-${Math.random().toString(36).substring(2, 7)}`;

        await prisma.news.create({
            data: {
                title: item.title || "Untitled News",
                slug: slug,
                aiTitle: aiTitle,
                content: item.contentSnippet || item.summary || item.description || "",
                aiContent: aiContent,
                factBlock: "",
                sourceName: item.sourceName,
                sourceUrl: item.link || slug,
                status: 'DRAFT',
                category: type,
                relevanceScore: relevanceScore
            }
        });
        return true;
    } catch (e) {
        console.error("AI Error:", e);
        return false;
    }
}
