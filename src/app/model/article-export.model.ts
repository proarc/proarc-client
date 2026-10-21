import { ExportFilters } from './export-statistic.model';
export interface ArticleExport {
  source: string; pid: string; model: string; dois: string[]; exportType: string;
  date: string; username: string; siglas: string[]; exportId: string;
}
export interface ArticleExportResult {
  filters: ExportFilters; articles: ArticleExport[]; count: number; offset: number; limit: number;
}
