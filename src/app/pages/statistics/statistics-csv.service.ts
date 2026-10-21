import { exportTypeLabel } from './export-type-label';
import { ArticleExportResult } from '../../model/article-export.model';
import { ExportStatistic } from '../../model/export-statistic.model';
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ModelStatistic } from '../../model/model-statistic.model';
import { ProductivityStatistic } from '../../model/productivity-statistic.model';
import { buildStatisticsCsv, buildTabularStatisticsCsv } from './statistics-csv';

@Injectable({ providedIn: 'root' })
export class StatisticsCsvService {
  private readonly translator = inject(TranslateService);
  private readonly auth = inject(AuthService);

  exportModels(active: boolean, counts: ModelStatistic[], respectOrganization: boolean): void {
    this.download(active ? 'statistics.activeByModel' : 'statistics.inactiveByModel', [
      this.filter('statistics.csv.state', this.t(active ? 'statistics.csv.active' : 'statistics.csv.inactive')),
      this.filter('statistics.model', this.t('statistics.productivity.allModels')),
      this.organization(respectOrganization)
    ], counts, active ? 'proarc-active-objects.csv' : 'proarc-inactive-objects.csv');
  }

  exportProductivity(result: ProductivityStatistic, respectOrganization: boolean): void {
    this.download('statistics.productivity.title', [
      this.filter('statistics.productivity.user', result.usernames.length ? result.usernames.join(', ') : this.t('statistics.productivity.allUsers')),
      this.filter('statistics.productivity.dateFrom', this.date(result.dateFrom)),
      this.filter('statistics.productivity.dateTo', this.date(result.dateTo)),
      this.filter('statistics.model', result.models.length ? result.models.map(model => this.modelLabel(model)).join(', ') : this.t('statistics.productivity.allModels')),
      this.filter('statistics.sigla', result.siglas?.length ? result.siglas.join(', ') : this.t('statistics.exports.all')),
      this.filter('statistics.productivity.operation', this.t('statistics.productivity.ingest')),
      this.organization(respectOrganization)
    ], result.modelCounts, 'proarc-productivity-' + result.dateFrom + '_' + result.dateTo + '.csv');
  }

  exportExports(result: ExportStatistic, devices: Record<string, string>, software: Record<string, string>): void {
    const f = result.filters;
    const t = (key: string) => this.t('statistics.exports.' + key);
    const selected = (values: string[], label: (id: string) => string = id => id) => values.length ? values.map(label).join(', ') : t('all');
    const filters = [
      this.filter('statistics.exports.user', selected(f.usernames)),
      this.filter('statistics.productivity.dateFrom', this.date(f.dateFrom)),
      this.filter('statistics.productivity.dateTo', this.date(f.dateTo)),
      this.filter('statistics.model', selected(f.models, id => this.modelLabel(id))),
      this.filter('statistics.exports.exportType', selected(f.exportTypes, id => exportTypeLabel(id, key => this.t(key)))),
      this.filter('statistics.exports.device', selected(f.devices, id => devices[id] || id)),
      this.filter('statistics.exports.software', selected(f.software, id => software[id] || id)),
      this.filter('statistics.sigla', selected(f.siglas || [])),
      this.filter('statistics.exports.group', t(f.groupBy)),
      f.unique ? t('unique') : t('repeated'),
      this.filter('statistics.csv.organization', f.organization || this.t('statistics.allOrganizations'))
    ];
    const rows = result.groups.map(group => [
      this.modelLabel(group.model), group.pageCount, group.otherModelCount,
      group.pageCount + group.otherModelCount, group.count, group.incompleteCount
    ]);
    const headers = [this.t('statistics.model'), t('pages'), t('others'), t('objects'), t('packages'), t('incompleteColumn')];
    this.saveCsv(buildTabularStatisticsCsv(t('title'),
      this.filter('statistics.csv.filters', filters.join(' | ')), headers, rows),
      'proarc-exports-' + f.groupBy + '-' + f.dateFrom + '_' + f.dateTo + '.csv');
  }

  exportArticles(result: ArticleExportResult): void {
    const f = result.filters;
    const filters = [f.dateFrom, f.dateTo, this.filter('statistics.model', f.models.join(', ') || this.t('statistics.exports.all')),
      this.filter('statistics.exports.exportType', f.exportTypes.map(type => this.articleExportTypeLabel(type)).join(', ') || this.t('statistics.exports.all')),
      this.filter('statistics.sigla', f.siglas.join(', ') || this.t('statistics.exports.all')),
      this.filter('statistics.exports.user', f.usernames.join(', ') || this.t('statistics.exports.all')),
      this.filter('statistics.csv.organization', f.organization || this.t('statistics.allOrganizations')),
      this.t(f.unique ? 'statistics.exports.unique' : 'statistics.exports.repeated'),
      (result.offset + 1) + '–' + (result.offset + result.articles.length) + ' / ' + result.count];
    const headers = ['PID', this.t('statistics.model'), 'DOI', this.t('statistics.exports.exportType'), this.t('statistics.articles.date'), this.t('statistics.exports.user')];
    const rows = result.articles.map(row => [row.pid, this.modelLabel(row.model), row.dois.join(', '), this.articleExportTypeLabel(row.exportType), row.date, row.username || 'UNKNOWN']);
    this.saveCsv(buildTabularStatisticsCsv(this.t('statistics.articles.title'), filters.join(' | '), headers, rows),
      'proarc-article-exports-' + f.dateFrom + '_' + f.dateTo + '-page-' + (result.offset / result.limit + 1) + '.csv');
  }

  private articleExportTypeLabel(type: string): string {
    return exportTypeLabel(type, key => this.t(key));
  }

  private t(key: string): string { return this.translator.instant(key); }

  private filter(key: string, value: string): string { return this.t(key) + ': ' + value; }

  private organization(respectOrganization: boolean): string {
    const organization = respectOrganization
      ? (this.auth.user?.organization || this.t('statistics.organizationScope'))
      : this.t('statistics.allOrganizations');
    return this.filter('statistics.csv.organization', organization);
  }

  private date(value: string): string {
    return value.split('-').reverse().join('.');
  }

  private modelLabel(model: string): string {
    const key = 'model.' + model;
    const label = this.t(key);
    return label === key ? model : label;
  }

  private download(titleKey: string, filters: string[], counts: ModelStatistic[], filename: string): void {
    const rows = [...counts].sort((a, b) => b.count - a.count || a.model.localeCompare(b.model))
      .map(item => ({ model: this.modelLabel(item.model), count: item.count }));
    const csv = buildStatisticsCsv(this.t(titleKey), this.filter('statistics.csv.filters', filters.join(' | ')),
      this.t('statistics.model'), this.t('statistics.count'), rows);
    this.saveCsv(csv, filename);
  }

  private saveCsv(csv: string, filename: string): void {
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
