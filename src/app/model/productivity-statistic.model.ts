import { ModelStatistic } from './model-statistic.model';

export interface ProductivityStatistic {
  usernames: string[];
  dateFrom: string;
  dateTo: string;
  models: string[];
  siglas: string[];
  count: number;
  modelCounts: ModelStatistic[];
}
