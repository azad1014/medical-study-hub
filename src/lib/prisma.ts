import { PrismaClient } from "@prisma/client"

/**
 * Prisma 客户端单例
 *
 * 设计要点：
 * - 全局单例防止开发环境热重载时创建多个连接
 * - 连接池由 Prisma 自动管理，默认 10 连接
 * - 生产环境建议配置 PgBouncer 连接池
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["warn", "error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * 懒加载 Prisma 客户端（用于 API 路由，避免构建时连接数据库）
 */
export function getPrisma(): PrismaClient {
  return prisma
}
