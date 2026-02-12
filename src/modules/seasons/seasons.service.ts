/**
 * Seasons service: CRUD for admin.
 */
import { prisma } from "../../prisma/client.js";

export interface SeasonResponse {
  id: number;
  name: string;
  colorHex: string;
  iconName: string;
  duration: string;
  sortOrder: number;
}

function toResponse(s: { id: number; name: string; colorHex: string; iconName: string; duration: string; sortOrder: number }): SeasonResponse {
  return {
    id: s.id,
    name: s.name,
    colorHex: s.colorHex,
    iconName: s.iconName,
    duration: s.duration,
    sortOrder: s.sortOrder,
  };
}

export async function listSeasons(): Promise<SeasonResponse[]> {
  const list = await prisma.season.findMany({ orderBy: { sortOrder: "asc" } });
  return list.map(toResponse);
}

export async function getSeasonById(id: number): Promise<SeasonResponse | null> {
  const season = await prisma.season.findUnique({ where: { id } });
  return season ? toResponse(season) : null;
}

export interface CreateSeasonInput {
  name: string;
  colorHex: string;
  iconName: string;
  duration: string;
  sortOrder: number;
}

export async function createSeason(input: CreateSeasonInput): Promise<SeasonResponse> {
  const season = await prisma.season.create({
    data: {
      name: input.name,
      colorHex: input.colorHex,
      iconName: input.iconName,
      duration: input.duration,
      sortOrder: input.sortOrder,
    },
  });
  return toResponse(season);
}

export interface UpdateSeasonInput {
  name?: string;
  colorHex?: string;
  iconName?: string;
  duration?: string;
  sortOrder?: number;
}

export async function updateSeason(id: number, input: UpdateSeasonInput): Promise<SeasonResponse> {
  const season = await prisma.season.update({
    where: { id },
    data: {
      ...(input.name != null && { name: input.name }),
      ...(input.colorHex != null && { colorHex: input.colorHex }),
      ...(input.iconName != null && { iconName: input.iconName }),
      ...(input.duration != null && { duration: input.duration }),
      ...(input.sortOrder != null && { sortOrder: input.sortOrder }),
    },
  });
  return toResponse(season);
}

export async function deleteSeason(id: number): Promise<void> {
  await prisma.season.delete({ where: { id } });
}
