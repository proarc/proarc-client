import { StatisticsNumberPipe } from './shared/statistics-number.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ArticleExportsComponent } from './article-exports/article-exports.component';
import { ExportStatisticsComponent } from './export-statistics/export-statistics.component';
import { MatIconModule } from '@angular/material/icon';
import { StatisticsCsvService } from './shared/statistics-csv.service';
import { ModelBreakdownComponent } from './model-breakdown/model-breakdown.component';
import { ModelStatistic } from '../../model/model-statistic.model';
import { ProductivityComponent } from './productivity/productivity.component';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, distinctUntilChanged, map } from 'rxjs';
import moment from 'moment';
import { ApiService } from '../../services/api.service';

type DetailView = 'active' | 'inactive' | 'productivity' | 'exports' | 'articles';
interface StatisticsPreview {
  view: DetailView;
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
  imports: [StatisticsNumberPipe, MatButtonToggleModule, ArticleExportsComponent, ExportStatisticsComponent, MatIconModule, 
            ModelBreakdownComponent, ProductivityComponent, CommonModule, TranslateModule, MatButtonModule, MatCheckboxModule,
            MatProgressBarModule, MatCardModule],
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
  active = true;
  respectOrganization = false;
  resultRespectOrganization = false;
  private request?: Subscription;
  private previewRequests = new Subscription();
  loading = false;
  error = false;
  total = 0;
  visibleTotal = 0;
  updatedAt: Date | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => {
        const view = params.get('view');
        return view && ['active', 'inactive', 'productivity', 'exports', 'articles'].includes(view)
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
    return this.view === 'home' ? this.previews.some(item => item.loading) : this.loading;
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
      queryParams: { view: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private showDetail(view: DetailView): void {
    this.request?.unsubscribe();
    this.loading = false;
    this.view = view;
    if (view === 'productivity' || view === 'exports' || view === 'articles') return;
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
    if (this.view === 'articles') return 'statistics.articles.title';
    if (this.view === 'exports') return 'statistics.exports.title';
    return this.active ? 'statistics.activeByModel' : 'statistics.inactiveByModel';
  }

  private loadPreviews(): void {
    this.previewRequests.unsubscribe();
    this.previewRequests = new Subscription();
    const today = moment();
    this.previewDateFrom = today.clone().startOf('year').format('YYYY-MM-DD');
    this.previewDateTo = today.format('YYYY-MM-DD');
    for (const preview of this.previews) {
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
      this.loadPreviews();
      return;
    }
    if (this.view === 'productivity' || this.view === 'exports' || this.view === 'articles') return;
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
    this.visibleTotal = this.total;
    this.updatedAt = updatedAt;
  }

  updatedLabel(): string {
    return this.updatedAt?.toLocaleString(this.translator.currentLang !== 'en' ? 'cs-CZ' : 'en-GB') ?? '';
  }
}
