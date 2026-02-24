'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@prisma/client';
import { MapPin, Maximize, Layers, Eye, Phone, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PropertyList({ properties }: { properties: Property[] }) {
    if (properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Zap className="text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">검색된 매물이 없습니다.</p>
            </div>
        );
    }

    const formatPrice = (p: Property) => {
        if (p.transaction_type === '매매') {
            const value = p.sale_price! / 10000;
            return <><span className="text-sm mr-1.5 font-bold text-slate-500">매</span> <span className="text-xl font-bold tracking-tight">{value.toFixed(1)}</span><span className="text-sm font-semibold ml-0.5">억</span></>;
        }
        if (p.transaction_type === '전세') {
            const value = p.deposit / 10000;
            return <><span className="text-sm mr-1.5 font-bold text-slate-500">전</span> <span className="text-xl font-bold tracking-tight">{value.toFixed(1)}</span><span className="text-sm font-semibold ml-0.5">억</span></>;
        }
        return <><span className="text-sm mr-1.5 font-bold text-slate-500">월</span> <span className="text-xl font-bold tracking-tight">{p.deposit}/{p.rent}</span></>;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {properties.map((property, index) => (
                <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link href={`/property/${property.slug}`} className="group block">
                        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
                            {/* Thumbnail Container */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shadow-inner">
                                {property.thumbnail ? (
                                    <Image
                                        src={property.thumbnail}
                                        alt={property.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <Maximize size={32} />
                                    </div>
                                )}

                                {/* Badges Overlay */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {property.is_featured && (
                                        <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg flex items-center gap-1 backdrop-blur-sm">
                                            <Sparkles size={10} /> 추천
                                        </span>
                                    )}
                                    {index < 3 && (
                                        <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg flex items-center gap-1 backdrop-blur-sm">
                                            <Zap size={10} /> 신규
                                        </span>
                                    )}
                                </div>

                                {property.status === 'sold' && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                                        <div className="border-2 border-white/50 px-4 py-1 rounded-full">
                                            <span className="text-white font-black text-sm uppercase tracking-[0.2em]">계약 완료</span>
                                        </div>
                                    </div>
                                )}

                                {/* Info Bar at Bottom of Image */}
                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex gap-1.5">
                                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                            <MapPin size={14} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                            <Phone size={14} />
                                        </div>
                                    </div>
                                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-black uppercase text-slate-900 shadow-xl">
                                        상세보기 <ArrowRight size={10} className="inline ml-0.5" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex gap-1.5">
                                        <span className="text-[11px] font-bold text-blue-700 border-2 border-blue-100 bg-blue-50/50 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                                            {property.property_type}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-600 border-2 border-slate-100 px-2 py-0.5 rounded-lg uppercase tracking-wide bg-slate-50">
                                            {property.district}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                        <Eye size={13} /> {property.view_count}
                                    </div>
                                </div>

                                <h3 className="text-[17px] text-slate-900 font-bold line-clamp-1 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-relaxed py-0.5">
                                    {property.title}
                                </h3>

                                <div className="grid grid-cols-[1.2fr_0.8fr] gap-1 mb-4 border-y border-slate-100 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-800 min-w-0">
                                        <Maximize size={18} className="text-blue-600 shrink-0" />
                                        <span className="text-[14px] font-bold uppercase tracking-tighter truncate">
                                            {property.area} <span className="text-[11px] text-slate-400 font-normal">m²</span>
                                            <span className="ml-1 text-blue-600 font-bold">({(property.area * 0.3025).toFixed(1)}평)</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-800 min-w-0">
                                        <Layers size={18} className="text-blue-600 shrink-0" />
                                        <span className="text-[14px] font-bold uppercase tracking-tighter truncate">{property.floor}/{property.total_floor}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-1">
                                    <div className="text-slate-900 leading-normal">
                                        {formatPrice(property)}
                                    </div>
                                    <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-widest text-right">
                                        관리비 {property.maintenance_fee}만
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
