const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS_START");
  users.forEach(u => {
    console.log(`USER:${u.email}:${u.role}`);
  });
  console.log("USERS_END");
}
main().catch(console.error).finally(() => prisma.$disconnect());
