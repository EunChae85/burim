'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Store, CheckCircle, Search, Menu, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [phone, setPhone] = useState('031-123-4567');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: '홈', href: '/', icon: Home },
        { name: '아파트', href: '/apartment', icon: Building2 },
        { name: '원/투룸', href: '/room', icon: Building2 },
        { name: '상가/사무실', href: '/store', icon: Store },
        { name: '계약완료', href: '/contract', icon: CheckCircle },
    ];

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm h-14' : 'bg-white h-16 border-b'}`}>
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
                        <Building2 size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-slate-900 tracking-tight leading-tight italic py-0.5">부림부동산</span>
                        <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase leading-normal">공인중개사사무소</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Search & Contact */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors md:flex hidden">
                        <Search size={20} />
                    </button>
                    <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                    >
                        <Phone size={16} />
                        <span className="md:inline hidden">상담문의</span>
                    </a>
                    <button className="md:hidden p-2 text-slate-600">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}
