import type { Roadmap } from "./roadmap";

export type ProjectType = "software" | "hardware" | "both";

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  created_at: string;
  roadmap_json?: Roadmap | null;
  issues?: { count: number }[];
}

export const TYPE_LABEL: Record<ProjectType, string> = {
  software: "Software",
  hardware: "Hardware",
  both: "Software + Hardware",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
