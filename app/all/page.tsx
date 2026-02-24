import CategoryLayout from '@/components/CategoryLayout';

export default function AllPropertiesPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    return (
        <CategoryLayout
            title="등록된 매물 보기"
            description="전체 수원 지역의 등록된 매물 리스트입니다."
            searchParams={searchParams}
        />
    );
}
