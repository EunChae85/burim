import PropertyList from '@/components/PropertyList';
import { prisma } from '@/lib/prisma';
import { Building2, Store, Home, Map, ClipboardCheck, Phone, Zap, Sparkles, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SearchForm from '@/components/SearchForm';
import { format } from 'date-fns';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  let totalCount = 0;
  let activeCount = 0;
  let featuredProperties: any[] = [];
  let settings: any = null;
  let latestNews: any[] = [];

  try {
    const [total, active, featured, siteSettings, news] = await Promise.all([
      prisma.property.count().catch(() => 0),
      prisma.property.count({ where: { status: 'active' } }).catch(() => 0),
      prisma.property.findMany({
        where: { status: 'active', is_featured: true },
        take: 6,
        orderBy: { created_at: 'desc' },
      }).catch(() => []),
      prisma.siteSettings.findUnique({
        where: { id: 'singleton' },
      }).catch(() => null),
      // @ts-ignore - bypassing potential type sync issues
      prisma.news?.findMany({
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }).catch(() => []) || [],
    ]);

    totalCount = total;
    activeCount = active;
    featuredProperties = featured;
    settings = siteSettings;
    latestNews = news;
  } catch (error) {
    console.error("Home page data fetch error:", error);
  }

  const phone = settings?.phone || "031-123-4567";

  const categories = [
    { name: '아파트', href: '/apartment', icon: Building2, color: 'bg-blue-500', count: '12' },
    { name: '원/투룸', href: '/room', icon: Home, color: 'bg-indigo-500', count: '45' },
    { name: '상가/사무실', href: '/store', icon: Store, color: 'bg-amber-500', count: '28' },
    { name: '계약완료', href: '/contract', icon: ClipboardCheck, color: 'bg-slate-500', count: '150+' },
  ];

  const recentProperties = await prisma.property.findMany({
    where: { status: 'active' },
    take: 8,
    orderBy: { created_at: 'desc' },
  }).catch(() => []);

  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section */}
      <section className="relative h-[550px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.45] scale-105"
            priority
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-6 backdrop-blur-sm">
            <Sparkles size={14} />
            수원 프리미엄 부동산 전문
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            당신이 꿈꾸던 가치,<br />
            <span className="text-blue-400">부림부동산</span>에서 시작하세요.
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            수원 지역 전문가 부림부동산에서 엄선한 프리미엄 매물을 <br className="hidden md:block" />
            가장 빠르고 정확하게 소개해 드립니다.
          </p>

          <SearchForm />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 w-full -translate-y-12 z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col items-center p-6 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100"
            >
              <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <cat.icon size={28} />
              </div>
              <span className="font-bold text-slate-700 uppercase tracking-tight mb-1">{cat.name}</span>
              <span className="text-xs font-semibold text-slate-400">{cat.count}개의 매물</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 w-full space-y-32">
        {/* Latest News Section */}
        <section className="bg-slate-50 rounded-[40px] p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
                <Sparkles size={16} /> 실시간 부동산 트렌드
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 italic tracking-tighter uppercase transition-all">부동산 최근 동향</h2>
              <p className="text-slate-600 mb-8 leading-relaxed max-w-md font-medium">
                부림부동산 대표 공인중개사가 전해드리는 <br />
                수원 지역의 가장 뜨거운 소식을 확인하세요.
              </p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all uppercase tracking-tight italic shadow-lg shadow-slate-200"
              >
                뉴스 전체보기 &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {latestNews.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                  <p className="text-slate-400 font-bold uppercase italic">곧 새로운 소식이 등록됩니다.</p>
                </div>
              ) : (
                latestNews.map((news: any) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="group flex flex-col bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">전문가 리포트</span>
                      <span className="text-[10px] font-bold text-slate-400">{format(new Date(news.createdAt), 'yyyy.MM.dd')}</span>
                    </div>
                    <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                      {news.aiTitle || news.title}
                    </h3>
                    {/* Source info removed as requested */}
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-2 flex items-center gap-2">
                <Sparkles size={16} /> 추천 매물 컬렉션
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter italic">오늘의 추천 매물</h2>
            </div>
            <Link href="/all" className="font-bold text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all uppercase tracking-tight text-sm">
              등록된 매물 보기
            </Link>
          </div>
          <PropertyList properties={featuredProperties} />
        </section>

        {/* Recent Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-2 flex items-center gap-2">
                <Zap size={16} /> 신규 등록 매물
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter italic">최근 리스팅</h2>
            </div>
          </div>
          <PropertyList properties={recentProperties} />
        </section>
      </div>

      {/* CALL TO ACTION */}
      <section className="bg-blue-600 py-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 animate-pulse">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 tracking-tighter uppercase italic">당신을 위한 최적의 공간</h2>
          <p className="text-blue-100 mb-10 text-lg font-medium">
            원하시는 매물이 없으신가요? 부림 담당자에게 직접 문의주시면 <br />
            딱 맞는 매물을 가장 먼저 찾아드립니다.
          </p>
          <Link
            href={`tel:${phone}`}
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-extrabold text-xl hover:shadow-2xl transition-all active:scale-95 shadow-xl"
          >
            <Phone size={24} />
            {phone} 상담하기
          </Link>
        </div>
      </section>
    </div >
  );
}
