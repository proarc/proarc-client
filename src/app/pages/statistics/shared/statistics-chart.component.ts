import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StatisticsNumberPipe, StatisticsPercentPipe } from './statistics-number.pipe';
import { barChartScale } from './bar-chart';

interface ChartItem {
  model: string;
  color: string;
  count?: number;
  chartCount?: number;
}

@Component({
  selector: 'app-statistics-chart',
  imports: [MatButtonToggleModule, TranslateModule, StatisticsNumberPipe, StatisticsPercentPipe],
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.scss']
})
export class StatisticsChartComponent<T extends ChartItem> implements OnChanges {
  @Input() slices: { item: T }[] = [];
  @Input() valueKey: 'count' | 'chartCount' = 'count';
  @Input() titleKey = 'statistics.model';
  @Input() labels: Record<string, string> = {};
  @Output() modelClick = new EventEmitter<T>();
  private readonly translator = inject(TranslateService);
  chartType: 'pie' | 'bar' = 'pie';
  percent = false;
  width = 560;
  ticks: { value: number; y: number }[] = [];
  bars: { item: T; value: number; share: number; x: number; y: number; height: number }[] = [];

  ngOnChanges(): void {
    this.updateBars();
  }

  setPercent(percent: boolean): void {
    this.percent = percent;
    this.updateBars();
  }

  label(model: string): string {
    if (this.labels[model]) return this.labels[model];
    const key = 'model.' + model;
    const label = this.translator.instant(key);
    return label === key ? model : label;
  }

  private updateBars(): void {
    const values = this.slices.map(slice => slice.item[this.valueKey] ?? 0);
    const total = values.reduce((sum, value) => sum + value, 0);
    const scale = barChartScale(values, this.percent);
    this.width = Math.max(560, 100 + this.slices.length * 90);
    const columnWidth = (this.width - 100) / Math.max(1, this.slices.length);
    this.ticks = scale.ticks.map(value => ({ value, y: 300 - value / scale.maximum * 250 }));
    this.bars = this.slices.map(({ item }, index) => {
      const value = values[index];
      const share = total ? value / total : 0;
      const height = (this.percent ? share * 100 : value) / scale.maximum * 250;
      return { item, value, share, x: 90 + columnWidth * (index + 0.5), y: 300 - height, height };
    });
  }
}
