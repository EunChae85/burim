import CategoryLayout from '@/components/CategoryLayout';

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
