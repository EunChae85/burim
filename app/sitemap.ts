import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://burim-estate.com';

    // Base routes
    const routes = [
        '',
        '/news',
        '/apartment',
        '/room',
        '/store',
        '/contract',
        '/all',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    try {
        // Dynamic News routes
        const news = await prisma.news.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
        });

        const newsRoutes = news.map((item) => ({
            url: `${baseUrl}/news/${item.slug}`,
            lastModified: item.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        // Dynamic Property routes
        const properties = await prisma.property.findMany({
            where: { status: 'active' },
            select: { slug: true, updated_at: true },
        });

        const propertyRoutes = properties.map((item) => ({
            url: `${baseUrl}/property/${item.slug}`,
            lastModified: item.updated_at,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...routes, ...newsRoutes, ...propertyRoutes];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return routes;
    }
}
