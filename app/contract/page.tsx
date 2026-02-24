import CategoryLayout from '@/components/CategoryLayout';

export default function ContractCompletedPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return (
        <CategoryLayout
            title="계약 완료 매물"
            description="부림공인중개사에서 최근 성공적으로 거래가 완료된 프리미엄 매물입니다."
            statusFilter="sold"
            searchParams={searchParams}
        />
    );
}
