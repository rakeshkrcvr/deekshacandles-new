import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const coupon = await prisma.coupon.findFirst()
    console.log("Found coupon:", coupon)
    console.log("Has categoryIds:", 'categoryIds' in coupon!)
  } catch (error) {
    console.error("Test Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}
main()
