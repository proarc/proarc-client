import { StatisticsNumberPipe, StatisticsPercentPipe } from '../shared/statistics-number.pipe';
import { StatisticsFilterOptionsService } from '../shared/statistics-filter-options.service';
import { MatIconModule } from '@angular/material/icon';
import { StatisticsCsvService } from '../shared/statistics-csv.service';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
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
import { ProductivityStatistic } from '../../../model/productivity-statistic.model';
import { ApiService } from '../../../services/api.service';
import { UserSettings } from '../../../shared/user-settings';
import { ModelStatistic } from '../../../model/model-statistic.model';

interface ProductivityModel extends ModelStatistic {
  visible: boolean;
  color: string;
}

@Component({
  selector: 'app-productivity',
  imports: [StatisticsNumberPipe, StatisticsPercentPipe, MatIconModule, MatTableModule, MatTooltipModule,
    MatCheckboxModule, MatCardModule, CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatSelectModule, MatProgressBarModule, TranslateModule],
  providers: [MatDatepickerIntl, provideMomentDateAdapter({
    parse: { dateInput: ['D.M.YYYY', 'DD.MM.YYYY'] },
    display: {
      dateInput: 'DD.MM.YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  }, { strict: true })],
  templateUrl: './productivity.component.html',
  styleUrls: ['./productivity.component.scss']
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
  readonly settings = inject(UserSettings);
  readonly columns = ['show', 'model', 'count', 'share'];
  models: ProductivityModel[] = [];
  slices: { item: ProductivityModel; path: string }[] = [];
  visibleTotal = 0;
  selectedUsers: string[] = [];
  selectedModels: string[] = [];
  readonly defaultDateFrom = moment().startOf('year');
  readonly defaultDateTo = moment().startOf('day');
  dateFrom: Moment | null = this.defaultDateFrom.clone();
  dateTo: Moment | null = this.defaultDateTo.clone();

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
    return models.map(model => this.modelLabel(model)).join(', ');
  }

  modelLabel(model: string): string {
    const key = 'model.' + model;
    const label = this.translator.instant(key);
    return label === key ? model : label;
  }

  get allVisible(): boolean {
    return this.models.every(item => item.visible);
  }

  toggleModel(item: ProductivityModel): void {
    item.visible = !item.visible;
    this.updateChart();
  }

  showAllModels(): void {
    this.models.forEach(item => item.visible = true);
    this.updateChart();
  }

  private updateModels(counts: ModelStatistic[]): void {
    const hidden = new Set(this.models.filter(item => !item.visible).map(item => item.model));
    this.models = [...counts]
      .sort((a, b) => b.count - a.count || a.model.localeCompare(b.model))
      .map((item, index) => ({ ...item, visible: !hidden.has(item.model),
        color: index === 0 ? 'var(--app-color-primary, #456aa5)'
          : `hsl(${(index * 137.508) % 360}, 60%, 43%)` }));
    this.updateChart();
  }

  private updateChart(): void {
    this.visibleTotal = this.models.filter(item => item.visible).reduce((sum, item) => sum + item.count, 0);
    let angle = -Math.PI / 2;
    this.slices = this.models.filter(item => item.visible && item.count > 0).map(item => {
      const end = angle + item.count / this.visibleTotal * 2 * Math.PI;
      const point = (value: number) => `${150 + 140 * Math.cos(value)},${150 + 140 * Math.sin(value)}`;
      const middle = (angle + end) / 2;
      const path = `M150,150 L${point(angle)} A140,140 0 0,1 ${point(middle)} A140,140 0 0,1 ${point(end)} Z`;
      angle = end;
      return { item, path };
    });
  }

  load(): void {
    if (!this.dateFrom?.isValid() || !this.dateTo?.isValid() || this.invalidRange) return;
    this.request?.unsubscribe();
    this.error = false;
    const organization = this.respectOrganization;
    this.loading = true;
    this.request = this.api.getProductivityStatistics(this.selectedUsers, this.dateFrom.format('YYYY-MM-DD'), this.dateTo.format('YYYY-MM-DD'), this.selectedModels, organization)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: result => {
          this.result = result;
          this.resultRespectOrganization = organization;
          this.updateModels(result.modelCounts);
          this.loading = false;
        },
        error: () => { this.error = true; this.loading = false; }
      });
  }
}
