export interface ILabelCount {
  label: string;
  count: number;
}

export interface IHeatmapEntry {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface IDailyCount {
  date: string;
  count: number;
}

export interface IDashboard {
  totalClicks: number;
  botClicks: number;
  byDevice: ILabelCount[];
  byDeviceModel: ILabelCount[];
  byBrowser: ILabelCount[];
  byOs: ILabelCount[];
  clicksOverTime: IDailyCount[];
  heatmap: IHeatmapEntry[];
}
