import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NewsEditor from "@/components/admin/NewsEditor";

interface Props {
    params: { id: string };
}

export default async function AdminNewsEditPage({ params }: Props) {
    // @ts-ignore
    const news = await prisma.news?.findUnique({
        where: { id: params.id },
    });

    if (!news) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                        뉴스 기사 편집
                    </h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                        AI 생성 콘텐츠를 검토하고 발행합니다.
                    </p>
                </header>

                <NewsEditor news={news} />
            </div>
        </div>
    );
}
