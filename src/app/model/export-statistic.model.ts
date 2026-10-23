export type ExportGrouping = 'model' | 'exportType' | 'device' | 'software' | 'equipment';
export interface ExportFilters {
  dateFrom: string;
  dateTo: string;
  usernames: string[];
  models: string[];
  siglas: string[];
  exportTypes: string[];
  devices: string[];
  software: string[];
  groupBy: ExportGrouping;
  unique: boolean;
  organization?: string;
}
export interface ExportGroup {
  exportType: string | null;
  devices: string[];
  software: string[];
  model: string;
  count: number;
  pageCount: number;
  otherModelCount: number;
  incompleteCount: number;
}
export interface ExportStatistic {
  filters: ExportFilters;
  groups: ExportGroup[];
  count: number;
  pageCount: number;
  otherModelCount: number;
  incompleteCount: number;
}
export interface ExportOptions {
  sigla: string[];
  user: string[];
  model: string[];
  exportType: string[];
  device: string[];
  software: string[];
}

export interface PackageExport {
  source: string;
  pid: string;
  model: string | null;
  urnNbns: string[];
  label: string | null;
  exportType: string | null;
  date: string;
  username: string | null;
  siglas: string[];
  devices: string[];
  software: string[];
  pageCount: number | null;
  otherModelCount: number | null;
}
export interface PackageExportResult {
  filters: ExportFilters;
  packages: PackageExport[];
  count: number;
  offset: number;
  limit: number;
}
