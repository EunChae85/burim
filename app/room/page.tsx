import CategoryLayout from '@/components/CategoryLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '원룸 / 투룸',
    description: '수원 전지역 풀옵션 원룸, 투룸 전세/월세 매물. 매교역, 세류역 인근 대학생 및 직장인 맞춤 매물을 확인하세요.',
};

export default function RoomPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return (
        <CategoryLayout
            title="원룸 / 투룸"
            description="수원 전지역 풀옵션 원룸, 투룸 매물입니다."
            typeFilter={['원룸', '투룸']}
            searchParams={searchParams}
        />
    );
}
