"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteNewsButton({ newsId }: { newsId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm("정말 이 뉴스를 삭제하시겠습니까?")) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`/api/admin/news/${newsId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "삭제에 실패했습니다.");
            }

            alert("성공적으로 삭제되었습니다.");
            router.refresh(); // 새로고침하여 목록 갱신
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2 rounded-lg transition-all ${isDeleting
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-100 text-slate-400 hover:bg-red-600 hover:text-white"
                }`}
            title="삭제하기"
        >
            <Trash2 size={18} />
        </button>
    );
}
