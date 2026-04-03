const { PrismaClient } = require('./lib/generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({ select: { id: true, title: true } });
    console.log(JSON.stringify(products, null, 2));
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
