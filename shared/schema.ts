import { z } from "zod";

export const holidayDataSchema = z.object({
  2025: z.set(z.string()),
  2026: z.set(z.string()),
});

export const holidayNamesSchema = z.record(z.string(), z.string());

export const dateSelectionSchema = z.object({
  rangeStart: z.date().nullable(),
  rangeEnd: z.date().nullable(),
});

export type HolidayData = z.infer<typeof holidayDataSchema>;
export type HolidayNames = z.infer<typeof holidayNamesSchema>;
export type DateSelection = z.infer<typeof dateSelectionSchema>;

export interface DownloadRequest {
  dates: Date[];
}

export interface DownloadResponse {
  urls: string[];
  success: boolean;
}
