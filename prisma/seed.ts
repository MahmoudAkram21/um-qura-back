/**
 * Prisma seed: Seasons, Stars, and default Admin
 * Run with: npx prisma db seed
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionUrl = process.env.DATABASE_URL;
if (!connectionUrl) throw new Error("DATABASE_URL is not set");

// Parse DATABASE_URL (mysql://user:pass@host:port/db) into PoolConfig for mariadb adapter
const url = new URL(connectionUrl.replace(/^mysql:\/\//, "https://"));
const poolConfig = {
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: url.username || undefined,
  password: url.password || undefined,
  database: url.pathname ? url.pathname.slice(1) : undefined,
};
const adapter = new PrismaMariaDb(poolConfig);
const prisma = new PrismaClient({ adapter });

// Use current year for seed dates (month/day are fixed)
const year = new Date().getFullYear();

async function main() {
  console.log("Seeding seasons and stars...");

  // Create 4 seasons
  const winter = await prisma.season.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Winter",
      colorHex: "#4A90D9",
      iconName: "snowflake",
      duration: "December - February",
      sortOrder: 1,
    },
  });

  const spring = await prisma.season.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Spring",
      colorHex: "#7CB342",
      iconName: "leaf",
      duration: "March - May",
      sortOrder: 2,
    },
  });

  const summer = await prisma.season.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Summer",
      colorHex: "#FFB74D",
      iconName: "sun",
      duration: "June - August",
      sortOrder: 3,
    },
  });

  const autumn = await prisma.season.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Autumn",
      colorHex: "#E57373",
      iconName: "wind",
      duration: "September - November",
      sortOrder: 4,
    },
  });

  const seasonIds = { winter: winter.id, spring: spring.id, summer: summer.id, autumn: autumn.id };

  // Helper to create a star
  const createStar = async (
    seasonId: number,
    name: string,
    startMonth: number,
    startDay: number,
    endMonth: number,
    endDay: number
  ) => {
    await prisma.star.upsert({
      where: { id: 0 }, // will use create only via findFirst + create
      update: {},
      create: {
        seasonId,
        name,
        startDate: new Date(year, startMonth - 1, startDay),
        endDate: new Date(year, endMonth - 1, endDay),
        description: null,
        weatherInfo: null,
        agriculturalInfo: [],
        tips: [],
      },
    }).catch(() => {});
  };

  // Delete existing stars to avoid duplicates, then create
  await prisma.star.deleteMany({});

  // Winter stars (sample)
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.winter, name: "الشرطان", startDate: new Date(year, 0, 6), endDate: new Date(year, 0, 19), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "البلدة", startDate: new Date(year, 0, 20), endDate: new Date(year, 1, 2), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "سعد الذابح", startDate: new Date(year, 1, 3), endDate: new Date(year, 1, 16), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Spring stars
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.spring, name: "سعد بلع", startDate: new Date(year, 2, 17), endDate: new Date(year, 2, 30), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "سعد السعود", startDate: new Date(year, 3, 1), endDate: new Date(year, 3, 13), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "سعد الأخبية", startDate: new Date(year, 3, 14), endDate: new Date(year, 3, 26), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Summer stars
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.summer, name: "الفرع المقدم", startDate: new Date(year, 5, 22), endDate: new Date(year, 6, 5), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "الفرع المؤخر", startDate: new Date(year, 6, 6), endDate: new Date(year, 6, 19), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "الزبرة", startDate: new Date(year, 6, 20), endDate: new Date(year, 7, 2), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Autumn stars
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.autumn, name: "الصرفة", startDate: new Date(year, 8, 17), endDate: new Date(year, 8, 30), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "العواء", startDate: new Date(year, 9, 1), endDate: new Date(year, 9, 13), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "السماك", startDate: new Date(year, 9, 14), endDate: new Date(year, 9, 26), description: null, weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Default admin (use ADMIN_EMAIL / ADMIN_PASSWORD in .env or defaults)
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
    },
  });
  console.log("Seed completed: 4 seasons, 12 stars, and admin user created.");
  console.log("Admin login:", adminEmail, "| Change ADMIN_PASSWORD in production.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
