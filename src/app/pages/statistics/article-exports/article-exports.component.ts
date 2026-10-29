import { StatisticsNumberPipe } from '../shared/statistics-number.pipe';
import { exportTypeLabel as formatExportTypeLabel } from '../shared/export-type-label';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import 'moment/locale/cs';
import 'moment/locale/en-gb';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment, { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { ArticleExportResult } from '../../../model/article-export.model';
import { ExportFilters, ExportOptions } from '../../../model/export-statistic.model';
import { ApiService } from '../../../services/api.service';
import { StatisticsFilterOptionsService } from '../shared/statistics-filter-options.service';
import { StatisticsCsvService } from '../shared/statistics-csv.service';

@Component({
  selector: 'app-article-exports',
  imports: [StatisticsNumberPipe, MatIconModule, MatDatepickerModule, CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatProgressBarModule, TranslateModule],
  providers: [MatDatepickerIntl, provideMomentDateAdapter({
    parse: { dateInput: ['D.M.YYYY', 'DD.MM.YYYY'] },
    display: { dateInput: 'DD.MM.YYYY', monthYearLabel: 'MMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY' }
  }, { strict: true })],
  templateUrl: './article-exports.component.html',
  styleUrls: ['./article-exports.component.scss']
})
export class ArticleExportsComponent implements OnInit, OnChanges {
  @Input() respectOrganization = false;
  @Output() respectOrganizationChange = new EventEmitter<boolean>();
  private readonly api = inject(ApiService);
  private readonly filterOptions = inject(StatisticsFilterOptionsService);
  private readonly destroyRef = inject(DestroyRef);
  readonly csv = inject(StatisticsCsvService);
  private readonly dateAdapter = inject<DateAdapter<Moment>>(DateAdapter);
  private readonly datepickerIntl = inject(MatDatepickerIntl);
  datePlaceholder = 'DD.MM.RRRR';
  private readonly translator = inject(TranslateService);
  readonly articleModels = ['model:ndkarticle', 'model:ndkearticle', 'model:bdmarticle'];
  unique = true;
  dateFrom: Moment | null = moment().startOf('year');
  dateTo: Moment | null = moment().startOf('day');
  models: string[] = []; types = ['exportProfile.crossref']; siglas: string[] = []; users: string[] = [];
  options: ExportOptions = { user: [], model: [], exportType: [], sigla: [], device: [], software: [] };
  exportTypes = ['exportProfile.crossref'];
  loading = false; error = false; optionsError = false;
  result: ArticleExportResult | null = null;
  private request?: Subscription;
  private optionsRequest?: Subscription;
  private appliedOrganization = false;
  get invalidRange(): boolean {
    return !!(this.dateFrom?.isValid() && this.dateTo?.isValid() && this.dateFrom.isAfter(this.dateTo, 'day'));
  }
  get invalid(): boolean { return !this.dateFrom?.isValid() || !this.dateTo?.isValid() || this.invalidRange; }
  ngOnInit(): void {
    this.setCalendarLanguage(this.translator.currentLang);
    this.translator.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => this.setCalendarLanguage(event.lang));
    this.loadOptions(); this.load();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['respectOrganization'] && !changes['respectOrganization'].firstChange) this.loadOptions();
  }
  loadOptions(): void {
    this.optionsRequest?.unsubscribe();
    this.optionsRequest = this.filterOptions.load(true, this.respectOrganization, true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.options = result.options; this.optionsError = result.incomplete;
        this.exportTypes = [...new Set(['exportProfile.crossref', ...result.options.exportType])]; },
      error: () => this.optionsError = true
    });
  }
  exportTypeLabel(type: string | null): string {
    return formatExportTypeLabel(type, key => this.translator.instant(key));
  }
  load(): void {
    if (this.invalid) return;
    const filters: ExportFilters = { dateFrom: this.dateFrom!.format('YYYY-MM-DD'), dateTo: this.dateTo!.format('YYYY-MM-DD'), models: [...this.models],
      exportTypes: [...this.types], siglas: [...this.siglas], usernames: [...this.users],
      devices: [], software: [], groupBy: 'model', unique: this.unique };
    this.fetch(filters, this.respectOrganization, 0);
  }
  download(): void {
    if (this.result) this.csv.exportArticles(this.result);
  }
  page(offset: number): void {
    if (this.result) this.fetch(this.result.filters, this.appliedOrganization, offset);
  }
  private fetch(filters: ExportFilters, organization: boolean, offset: number): void {
    this.request?.unsubscribe(); this.loading = true; this.error = false;
    this.request = this.api.getArticleExportStatistics(filters, organization, offset).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => { this.result = result; this.appliedOrganization = organization; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
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
