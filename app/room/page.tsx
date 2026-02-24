import CategoryLayout from '@/components/CategoryLayout';

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
