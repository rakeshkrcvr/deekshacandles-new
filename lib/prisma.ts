import { PrismaClient } from './generated/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaInstance_v2: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = global.prismaInstance_v2 ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  global.prismaInstance_v2 = prisma;
  console.log("💎 Prisma Initialized. Available models:", Object.keys(prisma).filter(k => !k.startsWith('_') && typeof (prisma as any)[k] === 'object'));
}
