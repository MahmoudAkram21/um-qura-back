/**
 * Stars service: business logic for calendar and CRUD.
 */
import { prisma } from "../../prisma/client.js";
import { formatDateForApi, formatDateRange } from "../../utils/dateFormat.js";
import type { StarCalendarItem, SeasonCalendarItem } from "../../types/stars.js";
import type { Prisma } from "../../generated/prisma/client.js";

const AGRICULTURAL_TIPS_JSON = "agriculturalInfo" as const;
const TIPS_JSON = "tips" as const;

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((x): x is string => typeof x === "string");
  }
  return [];
}

/** Get calendar data: seasons with stars, sorted; stars sorted by startDate. */
export async function getCalendar(): Promise<SeasonCalendarItem[]> {
  const seasons = await prisma.season.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      stars: {
        orderBy: { startDate: "asc" },
      },
    },
  });

  return seasons.map((season) => ({
    id: season.id,
    season_name: season.name,
    duration: season.duration,
    color_hex: season.colorHex,
    icon_name: season.iconName,
    stars: season.stars.map((star) => mapStarToCalendarItem(star)),
  }));
}

function mapStarToCalendarItem(star: {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  weatherInfo: string | null;
  agriculturalInfo: unknown;
  tips: unknown;
}): StarCalendarItem {
  return {
    id: star.id,
    name: star.name,
    start_date: formatDateForApi(star.startDate),
    end_date: formatDateForApi(star.endDate),
    date_range: formatDateRange(star.startDate, star.endDate),
    description: star.description,
    weather_info: star.weatherInfo,
    agricultural_info: ensureStringArray(star.agriculturalInfo),
    tips: ensureStringArray(star.tips),
  };
}

export interface ListStarsParams {
  page?: number;
  limit?: number;
  seasonId?: number;
}

export interface PaginatedStarsResult {
  stars: SeasonCalendarItem[]; // actually we return flat stars for admin list
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Admin: list stars with pagination. */
export async function listStars(params: ListStarsParams): Promise<{
  data: Array<{
    id: number;
    name: string;
    seasonId: number;
    season_name: string;
    start_date: string;
    end_date: string;
    date_range: string;
    description: string | null;
    weather_info: string | null;
    agricultural_info: string[];
    tips: string[];
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 10));
  const skip = (page - 1) * limit;

  const where: Prisma.StarWhereInput = {};
  if (params.seasonId != null) {
    where.seasonId = params.seasonId;
  }

  const [stars, total] = await Promise.all([
    prisma.star.findMany({
      where,
      orderBy: { startDate: "asc" },
      include: { season: true },
      skip,
      take: limit,
    }),
    prisma.star.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const data = stars.map((star) => ({
    id: star.id,
    name: star.name,
    seasonId: star.seasonId,
    season_name: star.season.name,
    start_date: formatDateForApi(star.startDate),
    end_date: formatDateForApi(star.endDate),
    date_range: formatDateRange(star.startDate, star.endDate),
    description: star.description,
    weather_info: star.weatherInfo,
    agricultural_info: ensureStringArray(star.agriculturalInfo),
    tips: ensureStringArray(star.tips),
  }));

  return { data, total, page, limit, totalPages };
}

/** Mobile: get the star that contains today's date (UTC date). Returns null if none. */
export async function getCurrentStar(): Promise<{
  id: number;
  name: string;
  seasonId: number;
  season_name: string;
  start_date: string;
  end_date: string;
  date_range: string;
  description: string | null;
  weather_info: string | null;
  agricultural_info: string[];
  tips: string[];
} | null> {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  const star = await prisma.star.findFirst({
    where: {
      startDate: { lte: todayEnd },
      endDate: { gte: todayStart },
    },
    include: { season: true },
    orderBy: { startDate: "asc" },
  });

  if (!star) return null;
  return {
    id: star.id,
    name: star.name,
    seasonId: star.seasonId,
    season_name: star.season.name,
    start_date: formatDateForApi(star.startDate),
    end_date: formatDateForApi(star.endDate),
    date_range: formatDateRange(star.startDate, star.endDate),
    description: star.description,
    weather_info: star.weatherInfo,
    agricultural_info: ensureStringArray(star.agriculturalInfo),
    tips: ensureStringArray(star.tips),
  };
}

/** Admin: get one star by id. */
export async function getStarById(id: number) {
  const star = await prisma.star.findUnique({
    where: { id },
    include: { season: true },
  });
  if (!star) return null;
  return {
    id: star.id,
    name: star.name,
    seasonId: star.seasonId,
    season_name: star.season.name,
    start_date: formatDateForApi(star.startDate),
    end_date: formatDateForApi(star.endDate),
    date_range: formatDateRange(star.startDate, star.endDate),
    description: star.description,
    weather_info: star.weatherInfo,
    agricultural_info: ensureStringArray(star.agriculturalInfo),
    tips: ensureStringArray(star.tips),
  };
}

export interface CreateStarInput {
  seasonId: number;
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string | null;
  weatherInfo?: string | null;
  agriculturalInfo?: string[];
  tips?: string[];
}

/** Admin: create star. */
export async function createStar(input: CreateStarInput) {
  const star = await prisma.star.create({
    data: {
      seasonId: input.seasonId,
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description ?? null,
      weatherInfo: input.weatherInfo ?? null,
      agriculturalInfo: (input.agriculturalInfo ?? []) as unknown as Prisma.JsonArray,
      tips: (input.tips ?? []) as unknown as Prisma.JsonArray,
    },
    include: { season: true },
  });
  return mapStarToCalendarItem(star);
}

export interface UpdateStarInput {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string | null;
  weatherInfo?: string | null;
  agriculturalInfo?: string[];
  tips?: string[];
}

/** Admin: update star. */
export async function updateStar(id: number, input: UpdateStarInput) {
  const star = await prisma.star.update({
    where: { id },
    data: {
      ...(input.name != null && { name: input.name }),
      ...(input.startDate != null && { startDate: input.startDate }),
      ...(input.endDate != null && { endDate: input.endDate }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.weatherInfo !== undefined && { weatherInfo: input.weatherInfo }),
      ...(input.agriculturalInfo !== undefined && { agriculturalInfo: input.agriculturalInfo as Prisma.JsonArray }),
      ...(input.tips !== undefined && { tips: input.tips as Prisma.JsonArray }),
    },
  });
  return mapStarToCalendarItem(star);
}

/** Admin: delete star. */
export async function deleteStar(id: number): Promise<boolean> {
  await prisma.star.delete({ where: { id } });
  return true;
}
