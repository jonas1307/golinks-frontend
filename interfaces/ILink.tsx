import { IMetric } from "./IMetric";

export interface ILink {
  id: string;
  url: string;
  slug: string;
  description: string;
  expiresAt?: string | null;
  maxUsage?: number | null;
  createdAt: string;
  totalUsage: number;
  metrics: IMetric[];
}
