'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewPropertyPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        district: '매교동',
        property_type: '원룸',
        transaction_type: '월세',
        deposit: '0',
        rent: '0',
        sale_price: '0',
        area: '0',
        supply_area: '0',
        floor: '1',
        total_floor: '5',
        maintenance_fee: '0',
        is_featured: false,
        is_shared: false,
        elevator: false,
        parking: false,
        thumbnail: '',
        images: [] as string[],
        options: [] as string[],
        direction: '남향',
        room_count: '1',
        bathroom_count: '1',
        move_in_date: '즉시입주',
        usage: '주거용',
        location_desc: '',
    });

    const districts = [
        '매교동', '세류동', '인계동', '교동', '매산로1가', '매산로2가', '매산로3가', '고등동', '화서동', '지동', '우만동',
        '팔달로1가', '팔달로2가', '팔달로3가', '남창동', '영동', '중동', '구천동', '남수동', '매향동', '신풍동', '장안동',
        '파장동', '정자동', '이목동', '율전동', '천천동', '영화동', '송죽동', '조원동', '연무동', '상광교동', '하광교동',
        '평동', '고색동', '오목천동', '평리동', '서둔동', '구운동', '탑동', '금곡동', '호매실동', '곡반정동', '권선동',
        '장지동', '대황교동', '입북동', '당수동', '매탄동', '원천동', '이의동', '하동', '영통동', '신동', '망포동', '지동', '행궁동', '광교동'
    ].sort();

    const propertyTypes = ['원룸', '투룸', '쓰리룸', '아파트', '상가', '사무실', '오피스텔', '빌라', '단독주택'];
    const transactionTypes = ['월세', '전세', '매매'];
    const availableOptions = ['에어컨', '세탁기', '냉장고', '가스레인지', '인덕션', '침대', '책상', '옷장', 'TV', '전자레인지', '도어락', '싱크대', '샤워부스', '베란다/발코니'];
    const directions = ['남향', '동향', '서향', '북향'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleOptionToggle = (option: string) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.includes(option)
                ? prev.options.filter(o => o !== option)
                : [...prev.options, option]
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.url) {
                if (!formData.thumbnail) {
                    setFormData(prev => ({ ...prev, thumbnail: data.url }));
                }
                setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('파일 업로드에 실패했습니다.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Options extra data
            const extraOptions = {
                ...formData.options.reduce((acc, opt) => ({ ...acc, [opt]: true }), {}),
                direction: formData.direction,
                room_count: formData.room_count,
                bathroom_count: formData.bathroom_count,
                move_in_date: formData.move_in_date,
                usage: formData.usage,
                supply_area: formData.supply_area,
            };

            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    deposit: parseInt(formData.deposit),
                    rent: parseInt(formData.rent) || null,
                    sale_price: parseInt(formData.sale_price) || null,
                    area: parseFloat(formData.area),
                    maintenance_fee: parseInt(formData.maintenance_fee),
                    options: extraOptions,
                    location_desc: formData.location_desc,
                }),
            });

            if (res.ok) {
                alert('매물이 성공적으로 등록되었습니다.');
                router.push('/admin');
            } else {
                const data = await res.json();
                alert(`등록 실패: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8 text-slate-900">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-100 transition-all">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">새 매물 등록</h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase italic tracking-tight hover:bg-blue-600 transition-all disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? '저장 중...' : '매물 저장하기'}
                    </button>
                </div>

                <form className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic">기본 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">매물 제목</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="예: 매교역 도보 5분 깔끔한 풀옵션 원룸"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">지역(동)</label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                >
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">매물 종류</label>
                                <select
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                >
                                    {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">상세 위치 설명 (예: 매교역 3번출구)</label>
                                <input
                                    type="text"
                                    name="location_desc"
                                    value={formData.location_desc}
                                    onChange={handleChange}
                                    placeholder="예: 매교역 3번출구, 권선초등학교"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                                <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase italic tracking-tighter">
                                    * 상세 페이지에 &quot;수원시 [지역] [입력값] 인근&quot;으로 표시됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Info */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic">가격 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">거래 유형</label>
                                <select
                                    name="transaction_type"
                                    value={formData.transaction_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                >
                                    {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">보증금 / 전세금 (만원)</label>
                                <input
                                    type="number"
                                    name="deposit"
                                    value={formData.deposit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            {formData.transaction_type === '월세' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">월세 (만원)</label>
                                    <input
                                        type="number"
                                        name="rent"
                                        value={formData.rent}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                    />
                                </div>
                            )}
                            {formData.transaction_type === '매매' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">매매가 (만원)</label>
                                    <input
                                        type="number"
                                        name="sale_price"
                                        value={formData.sale_price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detail Info */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic">상세 정보</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">전용 면적 (㎡)</label>
                                <input
                                    type="number"
                                    name="area"
                                    step="0.1"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">공급 면적 (㎡)</label>
                                <input
                                    type="number"
                                    name="supply_area"
                                    step="0.1"
                                    value={formData.supply_area}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">방향</label>
                                <select
                                    name="direction"
                                    value={formData.direction}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                >
                                    {directions.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">해당 층</label>
                                <input
                                    type="text"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">전체 층</label>
                                <input
                                    type="text"
                                    name="total_floor"
                                    value={formData.total_floor}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">관리비 (만원)</label>
                                <input
                                    type="number"
                                    name="maintenance_fee"
                                    value={formData.maintenance_fee}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">방 개수</label>
                                <input
                                    type="number"
                                    name="room_count"
                                    value={formData.room_count}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">욕실 개수</label>
                                <input
                                    type="number"
                                    name="bathroom_count"
                                    value={formData.bathroom_count}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">입주 가능일</label>
                                <input
                                    type="text"
                                    name="move_in_date"
                                    value={formData.move_in_date}
                                    onChange={handleChange}
                                    placeholder="예: 즉시입주, 24년 5월 이후"
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="checkbox" name="elevator" checked={formData.elevator} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                <span className="text-sm font-bold text-slate-700">엘리베이터</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                <span className="text-sm font-bold text-slate-700">주차 가능</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                <span className="text-sm font-bold text-slate-700">추천 매물</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                <input type="checkbox" name="is_shared" checked={formData.is_shared} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                <span className="text-sm font-bold text-slate-700">공동 중개</span>
                            </label>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic">시설 옵션</h2>
                        <div className="flex flex-wrap gap-3">
                            {availableOptions.map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleOptionToggle(option)}
                                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${formData.options.includes(option)
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-6 uppercase italic">사진 등록</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                                    <Image src={img} alt={`Upload ${idx}`} width={200} height={200} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                    {formData.thumbnail === img && (
                                        <div className="absolute bottom-0 inset-x-0 bg-blue-600 text-white text-[10px] font-bold text-center py-1">대표</div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                {uploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                                <span className="text-xs font-bold mt-2">사진 추가</span>
                            </button>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">대표 이미지 URL (직접 입력도 가능)</label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="mt-12 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black uppercase italic tracking-tight hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                    >
                        <Save size={24} />
                        {loading ? '등록 중...' : '매물 등록 완료하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
