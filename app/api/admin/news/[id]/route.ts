import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        // @ts-ignore
        const news = await prisma.news?.update({
            where: { id: params.id },
            data: {
                aiTitle: data.aiTitle,
                aiContent: data.aiContent,
                status: data.status,
            },
        });
        return NextResponse.json(news);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        await prisma.news?.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
