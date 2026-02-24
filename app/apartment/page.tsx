import CategoryLayout from '@/components/CategoryLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '아파트 / 오피스텔',
    description: '수원 매교동, 세류동 인근 준신축 아파트 및 오피스텔 매매/전세/월세 매물 정보를 확인하세요.',
};

export default function ApartmentPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return (
        <CategoryLayout
            title="아파트 / 오피스텔"
            description="수원 전지역 아파트/오피스텔 매물입니다."
            typeFilter={['아파트', '오피스텔']}
            searchParams={searchParams}
        />
    );
}
