import CategoryLayout from '@/components/CategoryLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '상가 / 사무실',
    description: '수원 전지역 상가, 사무실 임대 및 추천 매물. 매교동 신축 상가 및 대로변 사무실 전문 중개.',
};

export default function StorePage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return (
        <CategoryLayout
            title="상가 / 사무실"
            description="수원 전지역 상가 및 사무실 매물입니다."
            typeFilter={['상가', '오피스텔']}
            searchParams={searchParams}
        />
    );
}
