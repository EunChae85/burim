import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import InquiryForm from '@/components/InquiryForm';
import { MapPin, Eye, Phone, User, CheckCircle, Share2, Printer, Map as MapIcon, ChevronRight, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const property = await prisma.property.findUnique({
        where: { slug: params.slug },
    });

    if (!property) return { title: '매물을 찾을 수 없습니다' };

    const price = property.transaction_type === '매매'
        ? `${(property.sale_price! / 10000).toFixed(1)}억`
        : `${property.deposit}/${property.rent || 0}`;

    return {
        title: `${property.title} | ${property.district} ${property.property_type}`,
        description: `${property.district} ${property.property_type} ${property.transaction_type} ${price}. 면적 ${property.area}㎡, ${property.floor}층. ${(property as any).location_desc || ''}`,
        openGraph: {
            title: property.title,
            description: `${property.district} ${property.property_type} ${property.transaction_type} ${price}`,
            images: property.thumbnail ? [{ url: property.thumbnail }] : [],
            type: 'article',
        },
    };
}

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
    const property = await prisma.property.findUnique({
        where: { slug: params.slug },
    });

    if (!property) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        'name': property.title,
        'description': (property as any).location_desc || property.title,
        'datePosted': property.created_at.toISOString(),
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': property.district,
            'addressRegion': 'Gyeonggi-do',
            'addressCountry': 'KR'
        },
        'image': property.thumbnail || '',
        'offers': {
            '@type': 'Offer',
            'price': property.sale_price || property.deposit,
            'priceCurrency': 'KRW'
        }
    };

    const settings = await prisma.siteSettings.findUnique({
        where: { id: 'singleton' },
    });
    const phone = settings?.phone || "031-123-4567";

    // Increment view count in background
    prisma.property.update({
        where: { slug: params.slug },
        data: { view_count: { increment: 1 } },
    }).catch(console.error);

    const images = (property.images as string[]) || [];
    const options = (property.options as Record<string, boolean>) || {};

    const formatPrice = (p: any) => {
        if (p.transaction_type === '매매') {
            const value = (p.sale_price || 0) / 10000;
            return <><span className="text-blue-600 mr-2">매매</span> {value.toFixed(1)}억</>;
        }
        if (p.transaction_type === '전세') {
            const value = (p.deposit || 0) / 10000;
            return <><span className="text-blue-600 mr-2">전세</span> {value.toFixed(1)}억</>;
        }
        return <><span className="text-blue-600 mr-2">월세</span> {p.deposit}/{p.rent}</>;
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-slate-50 min-h-screen pb-40">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Gallery Section */}
                            <section className="relative group">
                                <div className="aspect-[16/9] bg-slate-200 rounded-[32px] overflow-hidden relative shadow-2xl">
                                    <Image
                                        src={property.thumbnail || images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200'}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {property.status === 'sold' && (
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                                            <div className="border-4 border-white/40 p-8 rounded-full">
                                                <span className="text-white font-black text-4xl uppercase tracking-[0.3em]">계약 완료</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {images.slice(0, 4).map((img, i) => (
                                        <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-slate-100 cursor-pointer hover:ring-4 ring-blue-600/20 transition-all">
                                            <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                                        </div>
                                    ))}
                                    {images.length > 4 && (
                                        <div className="aspect-[4/3] rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm text-center px-2">
                                            +{images.length - 4} 장 더 보기
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Title & Core Specs Section */}
                            <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{property.transaction_type}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Eye size={12} /> {property.view_count} 조회수</span>
                                        </div>
                                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter uppercase mb-4">{property.title}</h1>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-tight">
                                            <MapPin size={18} className="text-blue-600" />
                                            {property.district} · {property.property_type}
                                        </div>
                                    </div>
                                    <div className="hidden md:flex gap-2">
                                        <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all"><Share2 size={20} /></button>
                                        <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all"><Printer size={20} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-slate-100">
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">거래 금액</div>
                                        <div className="text-xl font-black text-blue-600 tracking-tighter">{formatPrice(property)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">해당 층 / 전체 층</div>
                                        <div className="text-xl font-black text-slate-900 tracking-tighter">{property.floor} / {property.total_floor}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">전용 면적</div>
                                        <div className="text-xl font-black text-slate-900 tracking-tighter">
                                            {property.area} <span className="text-sm">m²</span>
                                            <span className="text-xs text-blue-500 ml-2">({(property.area * 0.3025).toFixed(1)}평)</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">관리비</div>
                                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{property.maintenance_fee}<span className="text-sm">만</span></div>
                                    </div>
                                </div>
                            </section>

                            {/* Features & Options Table */}
                            <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-2">
                                    <ClipboardCheck size={20} className="text-blue-600" /> 상세 정보 및 옵션
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0.5">
                                    <div className="flex items-center py-5 border-b border-slate-50">
                                        <span className="w-24 md:w-32 shrink-0 text-sm font-black text-slate-500 uppercase tracking-tight">엘리베이터</span>
                                        <span className="font-black text-sm md:text-base text-slate-900">{property.elevator ? <span className="text-blue-600 flex items-center gap-1.5 uppercase"><CheckCircle size={18} strokeWidth={3} /> 있음</span> : <span className="text-slate-300 uppercase leading-none">없음</span>}</span>
                                    </div>
                                    <div className="flex items-center py-5 border-b border-slate-50">
                                        <span className="w-24 md:w-32 shrink-0 text-sm font-black text-slate-500 uppercase tracking-tight">주차 여부</span>
                                        <span className="font-black text-sm md:text-base text-slate-900">{property.parking ? <span className="text-blue-600 flex items-center gap-1.5 uppercase"><CheckCircle size={18} strokeWidth={3} /> 가능</span> : <span className="text-slate-300 uppercase leading-none">불가능</span>}</span>
                                    </div>
                                    {Object.entries(options).filter(([key]) => ![
                                        'direction', 'room_count', 'bathroom_count', 'move_in_date', 'usage', 'supply_area'
                                    ].includes(key)).map(([key, value]) => {
                                        const labels: Record<string, string> = {
                                            air_conditioner: '에어컨',
                                            washing_machine: '세탁기',
                                            refrigerator: '냉장고',
                                            tv: 'TV',
                                            closet: '옷장',
                                            microwave: '전자레인지',
                                            induction: '인덕션',
                                            desk: '책상',
                                            gas_range: '가스레인지',
                                            bed: '침대',
                                            door_lock: '도어락',
                                            sink: '싱크대',
                                            shower_booth: '샤워부스',
                                            balcony: '베란다/발코니'
                                        };
                                        return (
                                            <div key={key} className="flex items-center py-5 border-b border-slate-50">
                                                <span className="w-24 md:w-32 shrink-0 text-sm font-black text-slate-500 uppercase tracking-tight">{labels[key] || key}</span>
                                                <span className="font-black text-sm md:text-base text-slate-900">{value ? <span className="text-blue-600 flex items-center gap-1.5 uppercase"><CheckCircle size={18} strokeWidth={3} /> 있음</span> : <span className="text-slate-300 uppercase leading-none">없음</span>}</span>
                                            </div>
                                        );
                                    })}
                                    <div className="flex items-center py-5 border-b border-slate-50">
                                        <span className="w-24 md:w-32 shrink-0 text-sm font-black text-slate-500 uppercase tracking-tight">방향</span>
                                        <span className="font-black text-sm md:text-base text-slate-900">{options.direction || '남향'}</span>
                                    </div>
                                    <div className="flex items-center py-5 border-b border-slate-50">
                                        <span className="w-24 md:w-32 shrink-0 text-sm font-black text-slate-500 uppercase tracking-tight">구조</span>
                                        <span className="font-black text-sm md:text-base text-slate-900">{options.room_count}룸 / {options.bathroom_count}욕실</span>
                                    </div>
                                    <div className="flex items-center py-5 border-b border-slate-50">
                                        <span className="w-24 md:w-32 shrink-0 text-sm font-black text-slate-500 uppercase tracking-tight">입주 가능일</span>
                                        <span className="font-black text-sm md:text-base text-slate-900">{options.move_in_date || '즉시 협의 가능'}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Location Info Section */}
                            <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-8 flex items-center gap-2">
                                    <MapIcon size={20} className="text-blue-600" /> 상세 위치 안내
                                </h3>
                                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-slate-100">
                                    <MapPin size={32} className="text-blue-500 mb-4 opacity-50" />
                                    <p className="text-xl md:text-2xl font-black text-slate-900 leading-relaxed tracking-tight">
                                        수원시 <span className="text-blue-600">{property.district}</span> {(property as any).location_desc || '상세 위치'} 인근
                                    </p>
                                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        * 정확한 번지수는 방문 상담 시 안내해 드립니다.
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Inquiry Column */}
                        <div className="lg:col-span-1 border-slate-100">
                            <div className="sticky top-32 space-y-6">
                                <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                        <Phone size={100} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4">상담 예약 신청</div>
                                        <h4 className="text-2xl font-black tracking-tighter mb-8">관심있는 매물인가요? <br />지금 바로 상담하세요.</h4>
                                        <a href={`tel:${phone}`} className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg active:scale-95 mb-4 uppercase tracking-tight">
                                            <Phone size={20} /> {phone}
                                        </a>
                                        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">상담 가능: 월-토 09:00 - 20:00</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                                    <InquiryForm propertyId={property.id} />
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">담당 중개사</p>
                                        <h5 className="font-black text-slate-900 uppercase">문갑연 <span className="text-slate-400 font-bold ml-1 text-xs">대표</span></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Action Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 flex gap-3">
                    <a href={`tel:${phone}`} className="flex-1 bg-slate-900 text-white font-black py-4 rounded-2xl text-center uppercase tracking-widest shadow-lg">전화 상담</a>
                    <button className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg shadow-blue-200">매물 문의</button>
                </div>
            </div>
        </>
    );
}
