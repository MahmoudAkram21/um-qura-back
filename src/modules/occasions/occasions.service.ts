/**
 * Occasions service: CRUD and public display by Hijri sections.
 */
import { prisma } from "../../prisma/client.js";
import { getCurrentHijri, nextHijriMonth, formatHijriDateAr } from "../../utils/hijri.js";

export interface CreateOccasionInput {
  hijriMonth: number;
  hijriDay: number;
  title: string;
  prayerTitle: string;
  prayerText?: string | null;
}

export interface UpdateOccasionInput {
  hijriMonth?: number;
  hijriDay?: number;
  title?: string;
  prayerTitle?: string;
  prayerText?: string | null;
}

export interface OccasionRow {
  id: number;
  hijri_month: number;
  hijri_day: number;
  title: string;
  prayer_title: string;
  prayer_text: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapToRow(occ: {
  id: number;
  hijriMonth: number;
  hijriDay: number;
  title: string;
  prayerTitle: string;
  prayerText: string | null;
  createdAt: Date;
  updatedAt: Date;
}): OccasionRow {
  return {
    id: occ.id,
    hijri_month: occ.hijriMonth,
    hijri_day: occ.hijriDay,
    title: occ.title,
    prayer_title: occ.prayerTitle,
    prayer_text: occ.prayerText,
    created_at: occ.createdAt,
    updated_at: occ.updatedAt,
  };
}

function withDisplayDate(occ: OccasionRow): OccasionRow & { hijri_display: string } {
  return {
    ...occ,
    hijri_display: formatHijriDateAr(occ.hijri_day, occ.hijri_month),
  };
}

/** Admin: list all occasions with optional pagination. */
export async function listOccasions(params?: { page?: number; limit?: number }): Promise<{
  data: (OccasionRow & { hijri_display: string })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(100, Math.max(1, params?.limit ?? 50));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.occasion.findMany({
      orderBy: [{ hijriMonth: "asc" }, { hijriDay: "asc" }],
      skip,
      take: limit,
    }),
    prisma.occasion.count(),
  ]);

  const totalPages = Math.ceil(total / limit);
  const data = items.map((o) => withDisplayDate(mapToRow(o)));

  return { data, total, page, limit, totalPages };
}

/** Admin: get one occasion by id. */
export async function getOccasionById(id: number): Promise<(OccasionRow & { hijri_display: string }) | null> {
  const occ = await prisma.occasion.findUnique({ where: { id } });
  if (!occ) return null;
  return withDisplayDate(mapToRow(occ));
}

/** Admin: create occasion. */
export async function createOccasion(input: CreateOccasionInput): Promise<OccasionRow & { hijri_display: string }> {
  const occ = await prisma.occasion.create({
    data: {
      hijriMonth: input.hijriMonth,
      hijriDay: input.hijriDay,
      title: input.title,
      prayerTitle: input.prayerTitle,
      prayerText: input.prayerText ?? null,
    },
  });
  return withDisplayDate(mapToRow(occ));
}

/** Admin: update occasion. */
export async function updateOccasion(
  id: number,
  input: UpdateOccasionInput
): Promise<(OccasionRow & { hijri_display: string }) | null> {
  const occ = await prisma.occasion.update({
    where: { id },
    data: {
      ...(input.hijriMonth != null && { hijriMonth: input.hijriMonth }),
      ...(input.hijriDay != null && { hijriDay: input.hijriDay }),
      ...(input.title != null && { title: input.title }),
      ...(input.prayerTitle != null && { prayerTitle: input.prayerTitle }),
      ...(input.prayerText !== undefined && { prayerText: input.prayerText }),
    },
  }).catch(() => null);
  if (!occ) return null;
  return withDisplayDate(mapToRow(occ));
}

/** Admin: delete occasion. */
export async function deleteOccasion(id: number): Promise<boolean> {
  const result = await prisma.occasion.deleteMany({ where: { id } });
  return result.count > 0;
}

/** Public: get occasions grouped by today, current month, next month, full year. */
export async function getOccasionsForDisplay(): Promise<{
  today: (OccasionRow & { hijri_display: string })[];
  currentMonth: (OccasionRow & { hijri_display: string })[];
  nextMonth: (OccasionRow & { hijri_display: string })[];
  year: (OccasionRow & { hijri_display: string })[];
}> {
  const current = getCurrentHijri();
  const nextMonth = nextHijriMonth(current.month);

  const all = await prisma.occasion.findMany({
    orderBy: [{ hijriMonth: "asc" }, { hijriDay: "asc" }],
  });

  const withDisplay = all.map((o) => withDisplayDate(mapToRow(o)));

  const today = withDisplay.filter(
    (o) => o.hijri_month === current.month && o.hijri_day === current.day
  );
  const currentMonth = withDisplay.filter((o) => o.hijri_month === current.month);
  const nextMonthList = withDisplay.filter((o) => o.hijri_month === nextMonth);
  const year = withDisplay;

  return {
    today,
    currentMonth,
    nextMonth: nextMonthList,
    year,
  };
}
