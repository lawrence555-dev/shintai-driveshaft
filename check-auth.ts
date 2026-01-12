import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("=== USERS ===");
  users.forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`));
  
  const sessions = await prisma.session.findMany({
    include: { user: true }
  });
  console.log("\n=== SESSIONS ===");
  sessions.forEach(s => console.log(`Token: ${s.sessionToken.substring(0, 10)}..., User: ${s.user.email}, Role: ${s.user.role}, Expires: ${s.expires}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
