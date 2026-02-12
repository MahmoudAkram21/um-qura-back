/**
 * Prisma seed: Seasons, Stars, and default Admin
 * Run with: npx prisma db seed
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";

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
    update: { duration: "من 7 ديسمبر إلى 20 مارس (الشتاء)" },
    create: {
      name: "Winter",
      colorHex: "#4A90D9",
      iconName: "snowflake",
      duration: "من 7 ديسمبر إلى 20 مارس (الشتاء)",
      sortOrder: 1,
    },
  });

  const spring = await prisma.season.upsert({
    where: { id: 2 },
    update: { duration: "من 21 مارس إلى 21 يونيو (الربيع)" },
    create: {
      name: "Spring",
      colorHex: "#7CB342",
      iconName: "leaf",
      duration: "من 21 مارس إلى 21 يونيو (الربيع)",
      sortOrder: 2,
    },
  });

  const summer = await prisma.season.upsert({
    where: { id: 3 },
    update: { duration: "من 22 يونيو إلى 22 سبتمبر (الصيف)" },
    create: {
      name: "Summer",
      colorHex: "#FFB74D",
      iconName: "sun",
      duration: "من 22 يونيو إلى 22 سبتمبر (الصيف)",
      sortOrder: 3,
    },
  });

  const autumn = await prisma.season.upsert({
    where: { id: 4 },
    update: { duration: "من 23 سبتمبر إلى 6 ديسمبر (الخريف)" },
    create: {
      name: "Autumn",
      colorHex: "#E57373",
      iconName: "wind",
      duration: "من 23 سبتمبر إلى 6 ديسمبر (الخريف)",
      sortOrder: 4,
    },
  });

  const seasonIds = { winter: winter.id, spring: spring.id, summer: summer.id, autumn: autumn.id };
  const y = year;
  const yPrev = year - 1;

  // Delete existing stars to avoid duplicates, then create 28 stars
  await prisma.star.deleteMany({});

  // Winter stars (8): December uses year-1
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.winter, name: "الإكليل", startDate: new Date(yPrev, 11, 7), endDate: new Date(yPrev, 11, 19), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "القلب", startDate: new Date(yPrev, 11, 20), endDate: new Date(y, 0, 1), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "الشولة", startDate: new Date(y, 0, 2), endDate: new Date(y, 0, 14), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "النعايم", startDate: new Date(y, 0, 15), endDate: new Date(y, 0, 27), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "البلدة", startDate: new Date(y, 0, 28), endDate: new Date(y, 1, 9), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "سعد الذابح", startDate: new Date(y, 1, 10), endDate: new Date(y, 1, 22), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "سعد بلع", startDate: new Date(y, 1, 23), endDate: new Date(y, 2, 7), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.winter, name: "سعد السعود", startDate: new Date(y, 2, 8), endDate: new Date(y, 2, 20), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Spring stars (7)
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.spring, name: "سعد الأخبية", startDate: new Date(y, 2, 21), endDate: new Date(y, 3, 2), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "المقدم", startDate: new Date(y, 3, 3), endDate: new Date(y, 3, 15), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "المؤخر", startDate: new Date(y, 3, 16), endDate: new Date(y, 3, 28), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "الرشا", startDate: new Date(y, 3, 29), endDate: new Date(y, 4, 11), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "الشرطان", startDate: new Date(y, 4, 12), endDate: new Date(y, 4, 24), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "البطين", startDate: new Date(y, 4, 25), endDate: new Date(y, 5, 6), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.spring, name: "الثريا", startDate: new Date(y, 5, 7), endDate: new Date(y, 5, 19), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Summer stars (7)
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.summer, name: "الدبران", startDate: new Date(y, 5, 20), endDate: new Date(y, 6, 2), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "الهقعة", startDate: new Date(y, 6, 3), endDate: new Date(y, 6, 15), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "المنعة", startDate: new Date(y, 6, 16), endDate: new Date(y, 6, 28), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "المرزم", startDate: new Date(y, 6, 29), endDate: new Date(y, 7, 10), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "الكليبين", startDate: new Date(y, 7, 11), endDate: new Date(y, 7, 23), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "الطرف", startDate: new Date(y, 7, 24), endDate: new Date(y, 8, 5), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.summer, name: "الجبهة", startDate: new Date(y, 8, 6), endDate: new Date(y, 8, 19), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Autumn stars (6)
  await prisma.star.createMany({
    data: [
      { seasonId: seasonIds.autumn, name: "الزبرة", startDate: new Date(y, 8, 20), endDate: new Date(y, 9, 2), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "الصرفة", startDate: new Date(y, 9, 3), endDate: new Date(y, 9, 15), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "العواء", startDate: new Date(y, 9, 16), endDate: new Date(y, 9, 28), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "السماك", startDate: new Date(y, 9, 29), endDate: new Date(y, 10, 10), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "الغفر", startDate: new Date(y, 10, 11), endDate: new Date(y, 10, 23), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
      { seasonId: seasonIds.autumn, name: "الزبانا", startDate: new Date(y, 10, 24), endDate: new Date(y, 11, 6), description: "", weatherInfo: null, agriculturalInfo: [], tips: [] },
    ],
  });

  // Occasions (Hijri: month 1–12, day 1–30) – delete then create
  await prisma.occasion.deleteMany({});
  await prisma.occasion.createMany({
    data: [
      { hijriMonth: 1, hijriDay: 1, title: "رأس السنة الهجرية", prayerTitle: "دعاء بداية العام", prayerText: "اللهم أهلّه علينا بالأمن والإيمان والسلامة والإسلام." },
      { hijriMonth: 1, hijriDay: 10, title: "عاشوراء", prayerTitle: "دعاء يوم عاشوراء", prayerText: "اللهم إنّي أسألك بحقّ هذا اليوم ومن حفظته وورثته." },
      { hijriMonth: 3, hijriDay: 12, title: "المولد النبوي الشريف", prayerTitle: "الصلاة على النبي", prayerText: "اللهم صلّ على محمد وعلى آل محمد كما صلّيت على إبراهيم وعلى آل إبراهيم." },
      { hijriMonth: 7, hijriDay: 27, title: "ليلة الإسراء والمعراج", prayerTitle: "دعاء ليلة المعراج", prayerText: "سبحان الذي أسرى بعبده ليلاً من المسجد الحرام إلى المسجد الأقصى." },
      { hijriMonth: 8, hijriDay: 15, title: "ليلة النصف من شعبان", prayerTitle: "دعاء ليلة النصف من شعبان", prayerText: "اللهم إن كنت كتبتني عندك في أمّ الكتاب شقياً فامحُ عني واكتبني سعيداً." },
      { hijriMonth: 9, hijriDay: 1, title: "بداية شهر رمضان المبارك", prayerTitle: "دعاء استقبال رمضان", prayerText: "اللهم أهّل علينا شهر رمضان بالأمن والإيمان والسلامة والإسلام." },
      { hijriMonth: 9, hijriDay: 27, title: "ليلة القدر", prayerTitle: "دعاء ليلة القدر", prayerText: "اللهم إنك عفوّ تحب العفو فاعفُ عنّا." },
      { hijriMonth: 10, hijriDay: 1, title: "عيد الفطر المبارك", prayerTitle: "دعاء عيد الفطر", prayerText: "تقبّل الله منّا ومنكم صالح الأعمال. كلّ عام وأنتم بخير." },
      { hijriMonth: 12, hijriDay: 8, title: "يوم التروية", prayerTitle: "دعاء يوم التروية", prayerText: "اللهم اجعلني من الحجاج المقبولين والمعتمرين المرزوقين." },
      { hijriMonth: 12, hijriDay: 9, title: "يوم عرفة", prayerTitle: "دعاء يوم عرفة", prayerText: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير." },
      { hijriMonth: 12, hijriDay: 10, title: "عيد الأضحى المبارك", prayerTitle: "دعاء عيد الأضحى", prayerText: "تقبّل الله منّا ومنكم. كلّ عام وأنتم بخير. اللهم تقبّل منّا الطاعات." },
    ],
  });

  // Prayers – delete then create (for random endpoint)
  await prisma.prayer.deleteMany({});
  await prisma.prayer.createMany({
    data: [
      { text: "اللهم إني أسألك من الخير كله عاجله وآجله، ما علمت منه وما لم أعلم، وأعوذ بك من الشر كله عاجله وآجله، ما علمت منه وما لم أعلم." },
      { text: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً." },
      { text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار." },
      { text: "اللهم اهدني وسددني، اللهم إني أسألك الهدى والسداد." },
      { text: "اللهم اغفر لي وارحمني واهدني وعافني وارزقني." },
      { text: "سبحان الله وبحمده، سبحان الله العظيم." },
      { text: "اللهم صلّ على محمد وعلى آل محمد، كما صلّيت على إبراهيم وعلى آل إبراهيم، إنك حميد مجيد." },
      { text: "رضيت بالله رباً وبالإسلام ديناً وبمحمد صلى الله عليه وسلم نبياً." },
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
  console.log("Seed completed: 4 seasons, 28 stars, 11 occasions, 8 prayers, and admin user created.");
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
