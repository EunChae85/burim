const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.property.count();
        console.log('Total properties:', count);
        const activeCount = await prisma.property.count({ where: { status: 'active' } });
        console.log('Active properties:', activeCount);
        const sample = await prisma.property.findFirst();
        console.log('Sample property:', JSON.stringify(sample, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
