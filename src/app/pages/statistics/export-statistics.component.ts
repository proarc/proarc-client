import { exportTypeLabel as formatExportTypeLabel } from './export-type-label';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { ExportFilters, ExportGroup, ExportOptions, ExportStatistic } from '../../model/export-statistic.model';
import { ModelStatistic } from '../../model/model-statistic.model';
import { StatisticsFilterOptionsService } from './statistics-filter-options.service';
import { ApiService } from '../../services/api.service';
import { ModelBreakdownComponent } from './model-breakdown.component';
import { StatisticsCsvService } from './statistics-csv.service';

@Component({
  selector: 'app-export-statistics',
  imports: [MatButtonToggleModule, CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, TranslateModule, ModelBreakdownComponent],
  providers: [MatDatepickerIntl, provideMomentDateAdapter({
    parse: { dateInput: ['D.M.YYYY', 'DD.MM.YYYY'] },
    display: { dateInput: 'DD.MM.YYYY', monthYearLabel: 'MMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' }
  }, { strict: true })],
  templateUrl: './export-statistics.component.html'
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
  datePlaceholder = 'DD.MM.RRRR';
  dateFrom: Moment | null = moment().startOf('year');
  dateTo: Moment | null = moment().startOf('day');
  selectedUsers: string[] = [];
  selectedModels: string[] = [];
  selectedTypes: string[] = [];
  selectedDevices: string[] = [];
  selectedSoftware: string[] = [];
  selectedSiglas: string[] = [];
  unique = true;
  chartMode: 'pages' | 'others' | 'all' = 'pages';
  options: ExportOptions = { user: [], model: [], exportType: [], device: [], software: [], sigla: [] };
  deviceLabels: Record<string, string> = {};
  softwareLabels: Record<string, string> = {};
  result: ExportStatistic | null = null;
  loading = false;
  optionsError = false;
  error = false;
  chartCounts: ModelStatistic[] = [];
  exportCounts: Record<string, { pageCount: number; otherModelCount: number }> = {};
  labels: Record<string, string> = {};
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
    this.request?.unsubscribe(); this.error = false; this.loading = true;
    this.request = this.api.getExportStatistics(filters, this.respectOrganization).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.result = result; this.loading = false; this.rebuildCharts(); },
      error: () => { this.error = true; this.loading = false; }
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
    this.labels = {};
    this.exportCounts = {};
    this.chartCounts = (this.result?.groups || []).map(group => {
      this.labels[group.model] = this.groupLabel(group);
      this.exportCounts[group.model] = { pageCount: group.pageCount, otherModelCount: group.otherModelCount };
      return { model: group.model, count: this.chartMode === 'pages' ? group.pageCount
        : this.chartMode === 'others' ? group.otherModelCount : group.pageCount + group.otherModelCount };
    });
  }

  download(): void {
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
