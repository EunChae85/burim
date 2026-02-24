import CategoryLayout from '@/components/CategoryLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '계약 완료 매물',
    description: '이미 거래가 성사된 부림공인중개사의 우수 매물 포트폴리오입니다.',
};

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
