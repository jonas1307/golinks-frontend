import { IMetric } from "./IMetric";

export interface ILink {
  id: string;
  url: string;
  slug: string;
  description: string;
  createdAt: string;
  metrics: IMetric[];
}
