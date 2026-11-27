import { StatisticsChartComponent } from './shared/statistics-chart.component';
import { buildPieLabels, PieLabel } from './shared/pie-labels';
import { PieLabelsComponent } from './shared/pie-labels.component';
import { StatisticsNumberPipe, StatisticsPercentPipe } from './shared/statistics-number.pipe';
import { ServerUsageComponent } from './server-usage/server-usage.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ArticleExportsComponent } from './article-exports/article-exports.component';
import { ExportStatisticsComponent } from './export-statistics/export-statistics.component';
import { MatIconModule } from '@angular/material/icon';
import { StatisticsCsvService } from './shared/statistics-csv.service';
import { ModelBreakdownComponent } from './model-breakdown/model-breakdown.component';
import { ModelStatistic } from '../../model/model-statistic.model';
import { ProductivityComponent } from './productivity/productivity.component';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatisticsChart, UserSettings, UserSettingsService } from '../../shared/user-settings';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, distinctUntilChanged, map } from 'rxjs';
import moment from 'moment';
import { ApiService } from '../../services/api.service';

type DetailView = 'active' | 'inactive' | 'productivity' | 'exports' | 'articles' | 'storage';
interface StatisticsModel extends ModelStatistic {
  visible: boolean;
  color: string;
}

interface StatisticsPreview {
  view: StatisticsChart;
  titleKey: string;
  totalKey: string;
  emptyKey: string;
  counts: ModelStatistic[];
  total: number;
  loading: boolean;
  error: boolean;
  updatedAt: Date | null;
}

@Component({
  selector: 'app-statistics',
  imports: [ServerUsageComponent, RouterModule, StatisticsChartComponent, PieLabelsComponent, StatisticsNumberPipe, StatisticsPercentPipe, MatTableModule, MatTooltipModule, MatButtonToggleModule,
            ArticleExportsComponent, ExportStatisticsComponent, MatIconModule,
            ModelBreakdownComponent, ProductivityComponent, CommonModule, TranslateModule, MatButtonModule, MatCheckboxModule,
            MatProgressBarModule, MatCardModule, MatDialogModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly csv = inject(StatisticsCsvService);
  private readonly destroyRef = inject(DestroyRef);
  readonly translator = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly settings = inject(UserSettings);
  private readonly settingsService = inject(UserSettingsService);
  chartOptions: { view: StatisticsChart; titleKey: string; visible: boolean }[] = [];
  @ViewChild(ServerUsageComponent) serverUsage?: ServerUsageComponent;
  get showStorage(): boolean { return this.settings.statisticsCharts?.storage !== false; }
  view: 'home' | DetailView = 'home';
  readonly previews: StatisticsPreview[] = [
    { view: 'productivity', titleKey: 'statistics.productivity.title', totalKey: 'statistics.productivity.count', emptyKey: 'statistics.productivity.empty', counts: [], total: 0, loading: false, error: false, updatedAt: null },
    { view: 'exports', titleKey: 'statistics.exports.title', totalKey: 'statistics.exports.pages', emptyKey: 'statistics.exports.empty', counts: [], total: 0, loading: false, error: false, updatedAt: null },
    { view: 'articles', titleKey: 'statistics.articles.title', totalKey: 'statistics.articles.count', emptyKey: 'statistics.articles.empty', counts: [], total: 0, loading: false, error: false, updatedAt: null },
    { view: 'active', titleKey: 'statistics.activeByModel', totalKey: 'statistics.total', emptyKey: 'statistics.empty', counts: [], total: 0, loading: false, error: false, updatedAt: null }
  ];
  previewDateFrom = '';
  previewDateTo = '';
  models: ModelStatistic[] = [];
  readonly columns = ['show', 'model', 'count', 'share'];
  detailModels: StatisticsModel[] = [];
  slices: { item: StatisticsModel; path: string; middle: number }[] = [];
  active = true;
  respectOrganization = false;
  resultRespectOrganization = false;
  private request?: Subscription;
  private previewRequests = new Subscription();
  loading = false;
  error = false;
  total = 0;
  chartLabels: PieLabel[] = [];
  visibleTotal = 0;
  updatedAt: Date | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => {
        const view = params.get('view');
        return view && ['active', 'inactive', 'productivity', 'exports', 'articles', 'storage'].includes(view)
          ? view as DetailView : 'home';
      }),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(view => {
      if (view === 'home') this.showDashboard();
      else this.showDetail(view);
    });
  }

  get refreshing(): boolean {
    return this.view === 'home' ? this.visiblePreviews.some(item => item.loading) : this.loading;
  }

  get visiblePreviews(): StatisticsPreview[] {
    return this.previews.filter(item => this.settings.statisticsCharts?.[item.view] !== false);
  }

  openSettings(template: TemplateRef<unknown>): void {
    this.chartOptions = this.previews.map(item => ({ view: item.view, titleKey: item.titleKey,
      visible: this.settings.statisticsCharts?.[item.view] !== false }));
    this.chartOptions.push({ view: 'storage', titleKey: 'serverUsage.title', visible: this.showStorage });
    this.dialog.open(template, { width: '400px' }).afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(save => {
        if (!save) return;
        this.settings.statisticsCharts = Object.fromEntries(this.chartOptions.map(item => [item.view, item.visible]));
        this.settingsService.save(true);
        if (this.view === 'home') this.loadPreviews();
      });
  }

  open(view: DetailView): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view },
      queryParamsHandling: 'merge',
      // Switching the object state keeps Back pointing to the dashboard.
      replaceUrl: this.view !== 'home'
    });
  }

  showHome(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: null, disk: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private showDetail(view: DetailView): void {
    this.request?.unsubscribe();
    this.loading = false;
    this.view = view;
    if (view === 'productivity' || view === 'exports' || view === 'articles' || view === 'storage') return;
    this.active = view === 'active';
    const preview = this.previews.find(item => item.view === view);
    if (preview?.updatedAt && !preview.loading && !preview.error && !this.respectOrganization) {
      this.request?.unsubscribe();
      this.loading = false;
      this.error = false;
      this.applyCounts(preview.counts, preview.updatedAt, false);
    } else {
      this.updatedAt = null;
      this.models = [];
      this.load();
    }
  }

  private showDashboard(): void {
    this.request?.unsubscribe();
    this.loading = false;
    this.view = 'home';
    this.loadPreviews();
  }

  setOrganization(value: boolean): void {
    this.respectOrganization = value;
  }

  get titleKey(): string {
    if (this.view === 'storage') return 'serverUsage.title';
    if (this.view === 'articles') return 'statistics.articles.title';
    if (this.view === 'exports') return 'statistics.exports.title';
    return this.active ? 'statistics.activeByModel' : 'statistics.inactiveByModel';
  }

  private loadPreviews(): void {
    this.previewRequests.unsubscribe();
    this.previewRequests = new Subscription();
    this.previews.forEach(preview => preview.loading = false);
    const today = moment();
    this.previewDateFrom = today.clone().startOf('year').format('YYYY-MM-DD');
    this.previewDateTo = today.format('YYYY-MM-DD');
    for (const preview of this.visiblePreviews) {
      preview.loading = true;
      preview.error = false;
      preview.updatedAt = null;
      const source = preview.view === 'articles'
        ? this.api.getArticleExportStatistics({ dateFrom: this.previewDateFrom, dateTo: this.previewDateTo,
            usernames: [], models: [], exportTypes: ['exportProfile.crossref'], siglas: [], devices: [], software: [],
            groupBy: 'model', unique: true }, false, 0, 1)
            .pipe(map(result => ({ counts: [] as ModelStatistic[], total: result.count })))
        : preview.view === 'exports'
        ? this.api.getExportStatistics({
            dateFrom: this.previewDateFrom, dateTo: this.previewDateTo, usernames: [], models: [], exportTypes: ['exportProfile.ndk'], devices: [], software: [], siglas: [],
            groupBy: 'model', unique: true
          }, false).pipe(map(result => ({
            counts: result.groups.map(group => ({ model: group.model, count: group.pageCount })), total: result.pageCount
          })))
        : preview.view === 'productivity'
        ? this.api.getProductivityStatistics([], this.previewDateFrom, this.previewDateTo, [], false)
            .pipe(map(result => ({ counts: result.modelCounts, total: result.count })))
        : this.api.getModelStatistics(preview.view === 'active', false)
            .pipe(map(counts => ({ counts, total: counts.reduce((sum, item) => sum + item.count, 0) })));
      this.previewRequests.add(source.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: result => {
          preview.counts = result.counts;
          preview.total = result.total;
          preview.updatedAt = new Date();
          preview.loading = false;
        },
        error: () => {
          preview.error = true;
          preview.loading = false;
        }
      }));
    }
  }

  load(): void {
    if (this.view === 'home') {
      this.serverUsage?.refresh();
      this.loadPreviews();
      return;
    }
    if (this.view === 'productivity' || this.view === 'exports' || this.view === 'articles' || this.view === 'storage') return;
    this.request?.unsubscribe();
    const organization = this.respectOrganization;
    this.loading = true;
    this.error = false;
    const preview = this.previews.find(item => item.view === this.view);
    this.request = this.api.getModelStatistics(this.active, organization).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: counts => {
        this.applyCounts(counts, new Date(), organization);
        if (preview && !organization) {
          preview.counts = counts;
          preview.total = this.total;
          preview.updatedAt = this.updatedAt;
          preview.error = false;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private applyCounts(counts: ModelStatistic[], updatedAt: Date, organization: boolean): void {
    this.resultRespectOrganization = organization;
    this.models = counts;
    this.total = counts.reduce((sum, item) => sum + item.count, 0);
    const hidden = new Set(this.detailModels.filter(item => !item.visible).map(item => item.model));
    this.detailModels = [...counts]
      .sort((a, b) => b.count - a.count || a.model.localeCompare(b.model))
      .map((item, index) => ({ ...item, visible: !hidden.has(item.model),
        color: index === 0 ? 'var(--app-color-primary, #456aa5)'
          : `hsl(${(index * 137.508) % 360}, 60%, 43%)` }));
    this.updateChart();
    this.updatedAt = updatedAt;
  }

  modelLabel(model: string): string {
    const key = 'model.' + model;
    const label = this.translator.instant(key);
    return label === key ? model : label;
  }

  get allModelsVisible(): boolean {
    return this.detailModels.every(item => item.visible);
  }

  toggleModel(item: StatisticsModel): void {
    item.visible = !item.visible;
    this.updateChart();
  }

  showAllModels(): void {
    this.detailModels.forEach(item => item.visible = true);
    this.updateChart();
  }

  private updateChart(): void {
    this.visibleTotal = this.detailModels.filter(item => item.visible).reduce((sum, item) => sum + item.count, 0);
    let angle = -Math.PI / 2;
    this.slices = this.detailModels.filter(item => item.visible && item.count > 0).map(item => {
      const end = angle + item.count / this.visibleTotal * 2 * Math.PI;
      const point = (value: number) => `${150 + 140 * Math.cos(value)},${150 + 140 * Math.sin(value)}`;
      const middle = (angle + end) / 2;
      const path = `M150,150 L${point(angle)} A140,140 0 0,1 ${point(middle)} A140,140 0 0,1 ${point(end)} Z`;
      angle = end;
      return { item, path, middle };
    });
    this.chartLabels = buildPieLabels(this.slices, item => item.count);
  }

  updatedLabel(): string {
    return this.updatedAt?.toLocaleString(this.translator.currentLang !== 'en' ? 'cs-CZ' : 'en-GB') ?? '';
  }
}
