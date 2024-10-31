import { IMetric } from "./IMetric";

export interface ILink {
  id: string;
  url: string;
  slug: string;
  description: string;
  createdAt: string;
  totalUsage: number;
  metrics: IMetric[];
}
