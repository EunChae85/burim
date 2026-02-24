import CategoryLayout from '@/components/CategoryLayout';

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
