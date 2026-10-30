import { PackageExportResult } from '../../../model/export-statistic.model';
import { StatisticsNumberPipe, StatisticsPercentPipe } from '../shared/statistics-number.pipe';
import { exportTypeLabel as formatExportTypeLabel } from '../shared/export-type-label';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment, { Moment } from 'moment';
import 'moment/locale/cs';
import 'moment/locale/en-gb';
import { Subscription } from 'rxjs';
import { ExportFilters, ExportGroup, ExportOptions, ExportStatistic } from '../../../model/export-statistic.model';
import { StatisticsFilterOptionsService } from '../shared/statistics-filter-options.service';
import { ApiService } from '../../../services/api.service';
import { StatisticsCsvService } from '../shared/statistics-csv.service';
import { UserSettings } from '../../../shared/user-settings';

interface ExportModel extends ExportGroup {
  visible: boolean;
  color: string;
  chartCount: number;
}

@Component({
  selector: 'app-export-statistics',
  host: { class: 'app-statistics-report' },
  imports: [StatisticsNumberPipe, StatisticsPercentPipe, MatCardModule, MatPaginatorModule, MatTableModule,
    MatTooltipModule, CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, TranslateModule],
  providers: [MatDatepickerIntl, provideMomentDateAdapter({
    parse: { dateInput: ['D.M.YYYY', 'DD.MM.YYYY'] },
    display: { dateInput: 'DD.MM.YYYY', monthYearLabel: 'MMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' }
  }, { strict: true })],
  templateUrl: './export-statistics.component.html',
  styleUrls: ['./export-statistics.component.scss']
})
export class ExportStatisticsComponent implements OnInit, OnChanges {
  @Input() respectOrganization = false;
  @Output() respectOrganizationChange = new EventEmitter<boolean>();
  private readonly api = inject(ApiService);
  private readonly filterOptions = inject(StatisticsFilterOptionsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dateAdapter = inject<DateAdapter<Moment>>(DateAdapter);
  private readonly datepickerIntl = inject(MatDatepickerIntl);
  readonly translator = inject(TranslateService);
  readonly csv = inject(StatisticsCsvService);
  readonly settings = inject(UserSettings);
  readonly columns = ['show', 'model', 'pages', 'others', 'objects'];
  readonly packageColumns = ['pid', 'label', 'urnNbn', 'model', 'exportType', 'date', 'user', 'pages', 'others'];
  readonly defaultDateFrom = moment().startOf('year');
  readonly defaultDateTo = moment().startOf('day');
  datePlaceholder = 'DD.MM.RRRR';
  dateFrom: Moment | null = this.defaultDateFrom.clone();
  dateTo: Moment | null = this.defaultDateTo.clone();
  selectedUsers: string[] = [];
  selectedModels: string[] = [];
  selectedTypes: string[] = ['exportProfile.ndk'];
  selectedDevices: string[] = [];
  selectedSoftware: string[] = [];
  selectedSiglas: string[] = [];
  unique = true;
  viewMode: 'chart' | 'table' = 'chart';
  packageResult: PackageExportResult | null = null;
  packagesLoading = false;
  packagesError = false;
  private packageRequest?: Subscription;
  private appliedOrganization = false;
  private appliedFilters: ExportFilters | null = null;
  chartMode: 'pages' | 'others' | 'all' = 'pages';
  options: ExportOptions = { user: [], model: [], exportType: [], device: [], software: [], sigla: [] };
  deviceLabels: Record<string, string> = {};
  softwareLabels: Record<string, string> = {};
  result: ExportStatistic | null = null;
  loading = false;
  optionsError = false;
  error = false;
  models: ExportModel[] = [];
  slices: { item: ExportModel; path: string }[] = [];
  visibleTotal = 0;
  chartTotal = 0;
  private request?: Subscription;
  private optionsRequest?: Subscription;

  get invalidRange(): boolean {
    return !!(this.dateFrom?.isValid() && this.dateTo?.isValid() && this.dateFrom.isAfter(this.dateTo, 'day'));
  }
  get invalid(): boolean {
    return !this.dateFrom?.isValid() || !this.dateTo?.isValid() || this.invalidRange;
  }

  ngOnInit(): void {
    this.setCalendarLanguage(this.translator.currentLang);
    this.translator.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      this.setCalendarLanguage(event.lang); this.rebuildCharts();
    });
    this.loadOptions();
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.values(changes).some(change => !change.firstChange)) {
      this.loadOptions();
    }
  }

  loadOptions(): void {
    this.optionsRequest?.unsubscribe();
    this.optionsError = false;
    this.optionsRequest = this.filterOptions.load(true, this.respectOrganization).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.options = { ...result.options, model: result.options.model.filter(model =>
          !['model:ndkarticle', 'model:ndkearticle', 'model:bdmarticle'].includes(model)) };
        this.options.exportType = [...new Set(['exportProfile.ndk', ...this.options.exportType])];
        this.deviceLabels = result.deviceLabels;
        this.softwareLabels = result.softwareLabels;
        this.optionsError = result.incomplete;
        this.rebuildCharts();
      },
      error: () => this.optionsError = true
    });
  }

  load(): void {
    if (this.invalid) return;
    const filters: ExportFilters = {
      dateFrom: this.dateFrom!.format('YYYY-MM-DD'), dateTo: this.dateTo!.format('YYYY-MM-DD'),
      usernames: [...this.selectedUsers], models: [...this.selectedModels],
      exportTypes: [...this.selectedTypes],
      devices: [...this.selectedDevices],
      software: [...this.selectedSoftware],
      siglas: [...this.selectedSiglas],
      groupBy: 'model',
      unique: this.unique
    };
    this.result = null;
    this.packageRequest?.unsubscribe(); this.packageResult = null; this.packagesLoading = false; this.packagesError = false;
    this.appliedFilters = filters; this.appliedOrganization = this.respectOrganization;
    if (this.viewMode === 'table') this.loadPackages(0);
    this.request?.unsubscribe(); this.error = false; this.loading = true;
    this.request = this.api.getExportStatistics(filters, this.respectOrganization).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.result = result; this.loading = false; this.rebuildCharts(); },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  setViewMode(mode: 'chart' | 'table'): void {
    this.viewMode = mode;
    if (mode === 'table' && !this.packageResult && !this.packagesLoading) this.loadPackages(0);
  }

  loadPackages(offset: number): void {
    if (!this.appliedFilters) return;
    this.packageRequest?.unsubscribe(); this.packagesLoading = true; this.packagesError = false;
    this.packageRequest = this.api.getPackageExportStatistics(this.appliedFilters, this.appliedOrganization, offset)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: result => { this.packageResult = result; this.packagesLoading = false; },
        error: () => { this.packagesError = true; this.packagesLoading = false; }
      });
  }

  groupLabel(group: ExportGroup): string {
    const modelKey = 'model.' + group.model;
    const model = this.translator.instant(modelKey);
    return model === modelKey ? group.model : model;
  }

  exportTypeLabel(type: string | null): string {
    return formatExportTypeLabel(type, key => this.translator.instant(key));
  }

  get chartTitleKey(): string {
    return 'statistics.exports.' + (this.chartMode === 'pages' ? 'pages' : this.chartMode === 'others' ? 'others' : 'objects');
  }

  get chartEmptyKey(): string {
    return 'statistics.exports.' + (this.chartMode === 'pages' ? 'noPages' : this.chartMode === 'others' ? 'noOthers' : 'empty');
  }

  setChartMode(mode: 'pages' | 'others' | 'all'): void {
    this.chartMode = mode;
    this.rebuildCharts();
  }

  rebuildCharts(): void {
    const hidden = new Set(this.models.filter(item => !item.visible).map(item => item.model));
    this.models = [...(this.result?.groups || [])]
      .sort((a, b) => b.pageCount - a.pageCount || a.model.localeCompare(b.model))
      .map((group, index) => ({ ...group, visible: !hidden.has(group.model),
        color: index === 0 ? 'var(--app-color-primary, #456aa5)'
          : `hsl(${(index * 137.508) % 360}, 60%, 43%)`,
        chartCount: this.chartMode === 'pages' ? group.pageCount
          : this.chartMode === 'others' ? group.otherModelCount : group.pageCount + group.otherModelCount }));
    this.chartTotal = this.models.reduce((sum, item) => sum + item.chartCount, 0);
    this.updateChart();
  }

  get allVisible(): boolean {
    return this.models.every(item => item.visible);
  }

  toggleModel(item: ExportModel): void {
    item.visible = !item.visible;
    this.updateChart();
  }

  showAllModels(): void {
    this.models.forEach(item => item.visible = true);
    this.updateChart();
  }

  private updateChart(): void {
    this.visibleTotal = this.models.filter(item => item.visible).reduce((sum, item) => sum + item.chartCount, 0);
    let angle = -Math.PI / 2;
    this.slices = this.models.filter(item => item.visible && item.chartCount > 0).map(item => {
      const end = angle + item.chartCount / this.visibleTotal * 2 * Math.PI;
      const point = (value: number) => `${150 + 140 * Math.cos(value)},${150 + 140 * Math.sin(value)}`;
      const middle = (angle + end) / 2;
      const path = `M150,150 L${point(angle)} A140,140 0 0,1 ${point(middle)} A140,140 0 0,1 ${point(end)} Z`;
      angle = end;
      return { item, path };
    });
  }

  download(): void {
    if (this.viewMode === 'table') {
      if (this.packageResult && !this.packagesError) this.csv.exportPackages(this.packageResult, this.deviceLabels, this.softwareLabels);
      return;
    }
    if (this.result) this.csv.exportExports(this.result, this.deviceLabels, this.softwareLabels);
  }

  private setCalendarLanguage(language: string): void {
    const czech = language !== 'en';
    this.dateAdapter.setLocale(czech ? 'cs' : 'en-gb');
    this.datePlaceholder = czech ? 'DD.MM.RRRR' : 'DD.MM.YYYY';
    Object.assign(this.datepickerIntl, czech ? {
      calendarLabel: 'Kalendář',
      openCalendarLabel: 'Otevřít kalendář',
      closeCalendarLabel: 'Zavřít kalendář',
      prevMonthLabel: 'Předchozí měsíc',
      nextMonthLabel: 'Následující měsíc',
      prevYearLabel: 'Předchozí rok',
      nextYearLabel: 'Následující rok',
      prevMultiYearLabel: 'Předchozí období',
      nextMultiYearLabel: 'Následující období',
      switchToMonthViewLabel: 'Vybrat datum',
      switchToMultiYearViewLabel: 'Vybrat měsíc a rok',
      startDateLabel: 'Počáteční datum',
      endDateLabel: 'Koncové datum',
      comparisonDateLabel: 'Srovnávací datum'
    } : {
      calendarLabel: 'Calendar',
      openCalendarLabel: 'Open calendar',
      closeCalendarLabel: 'Close calendar',
      prevMonthLabel: 'Previous month',
      nextMonthLabel: 'Next month',
      prevYearLabel: 'Previous year',
      nextYearLabel: 'Next year',
      prevMultiYearLabel: 'Previous years',
      nextMultiYearLabel: 'Next years',
      switchToMonthViewLabel: 'Choose date',
      switchToMultiYearViewLabel: 'Choose month and year',
      startDateLabel: 'Start date',
      endDateLabel: 'End date',
      comparisonDateLabel: 'Comparison date'
    });
    this.datepickerIntl.changes.next();
  }
}
