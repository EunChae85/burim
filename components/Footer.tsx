import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Footer() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: 'singleton' },
    });

    const phone = settings?.phone || "031-123-4567";
    const address = settings?.address || "경기도 수원시 팔달구 매교동 123-45";
    const officeName = settings?.office_name || "부림공인중개사사무소";

    return (
        <footer className="bg-slate-900 text-slate-400 py-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                        <span className="text-white font-extrabold text-2xl italic tracking-tighter">부림부동산</span>
                    </Link>
                    <p className="max-w-sm mb-8 leading-relaxed">
                        수원 매교동과 세류동을 중심으로 정직하고 투명한 중개 서비스를 제공합니다.
                        고객님의 소중한 자산을 위한 최선의 선택, 부림이 함께합니다.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                            <span className="text-white font-bold text-xs uppercase text-center">Kakao</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                            <span className="text-white font-bold text-xs uppercase text-center">Blog</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">고객 센터</h4>
                    <ul className="space-y-4 text-sm">
                        <li>
                            <span className="block text-slate-500 mb-1">사무실 주소</span>
                            <span className="text-slate-300 uppercase leading-none text-xs">{officeName}</span>
                            <p className="text-slate-300">{address}</p>
                        </li>
                        <li>
                            <span className="block text-slate-500 mb-1">대표 전화</span>
                            <p className="text-white font-bold text-lg">{phone}</p>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
                <p>© 2026 BURIM REAL ESTATE. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-6 uppercase tracking-widest text-slate-500">
                    <Link href="#" className="hover:text-white">개인정보처리방침</Link>
                    <Link href="#" className="hover:text-white">이용약관</Link>
                    <Link href="/admin" className="hover:text-white border-l border-slate-700 pl-6">관리자</Link>
                </div>
            </div>
        </footer>
    );
}
