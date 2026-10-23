import { StatisticsNumberPipe } from './statistics-number.pipe';
import { StatisticsFilterOptionsService } from './statistics-filter-options.service';
import { MatIconModule } from '@angular/material/icon';
import { StatisticsCsvService } from './statistics-csv.service';
import { ModelBreakdownComponent } from './model-breakdown.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import 'moment/locale/cs';
import 'moment/locale/en-gb';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProductivityStatistic } from '../../model/productivity-statistic.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-productivity',
  imports: [StatisticsNumberPipe, MatIconModule, ModelBreakdownComponent, MatCheckboxModule, CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatProgressBarModule, TranslateModule],
  providers: [MatDatepickerIntl, provideMomentDateAdapter({
    parse: { dateInput: ['D.M.YYYY', 'DD.MM.YYYY'] },
    display: {
      dateInput: 'DD.MM.YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  }, { strict: true })],
  templateUrl: './productivity.component.html'
})
export class ProductivityComponent implements OnInit, OnChanges {
  @Input() respectOrganization = false;
  @Output() respectOrganizationChange = new EventEmitter<boolean>();
  private readonly api = inject(ApiService);
  private readonly filterOptions = inject(StatisticsFilterOptionsService);
  readonly csv = inject(StatisticsCsvService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dateAdapter = inject<DateAdapter<Moment>>(DateAdapter);
  private readonly datepickerIntl = inject(MatDatepickerIntl);
  datePlaceholder = 'DD.MM.RRRR';
  readonly translator = inject(TranslateService);
  selectedUsers: string[] = [];
  selectedModels: string[] = [];
  dateFrom: Moment | null = moment().startOf('year');
  dateTo: Moment | null = moment().startOf('day');

  get invalidRange(): boolean {
    return !!(this.dateFrom?.isValid() && this.dateTo?.isValid() && this.dateFrom.isAfter(this.dateTo, 'day'));
  }

  users: string[] = [];
  availableModels: string[] = [];
  optionsError = false;
  private optionsRequest?: Subscription;
  loading = false;
  error = false;
  result: ProductivityStatistic | null = null;
  resultRespectOrganization = false;
  private request?: Subscription;

  ngOnInit(): void {
    this.setCalendarLanguage(this.translator.currentLang);
    this.translator.onLangChange.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => this.setCalendarLanguage(event.lang));
    this.loadOptions();
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['respectOrganization'] && !changes['respectOrganization'].firstChange) this.loadOptions();
  }

  loadOptions(): void {
    this.optionsRequest?.unsubscribe();
    this.optionsError = false;
    this.optionsRequest = this.filterOptions.load(false, this.respectOrganization).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.users = result.options.user;
        this.availableModels = result.options.model;
        this.optionsError = result.incomplete;
      },
      error: () => this.optionsError = true
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

  modelLabels(models: string[]): string {
    return models.map(model => {
      const key = 'model.' + model;
      const label = this.translator.instant(key);
      return label === key ? model : label;
    }).join(', ');
  }

  load(): void {
    if (!this.dateFrom?.isValid() || !this.dateTo?.isValid() || this.invalidRange) return;
    this.request?.unsubscribe();
    this.error = false;
    const organization = this.respectOrganization;
    this.loading = true;
    this.request = this.api.getProductivityStatistics(this.selectedUsers, this.dateFrom.format('YYYY-MM-DD'), this.dateTo.format('YYYY-MM-DD'), this.selectedModels, organization)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: result => { this.result = result; this.resultRespectOrganization = organization; this.loading = false; },
        error: () => { this.error = true; this.loading = false; }
      });
  }
}
