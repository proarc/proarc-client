import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModelStatistic } from '../../model/model-statistic.model';

interface ModelCount extends ModelStatistic {
  visible: boolean;
  color: string;
}

@Component({
  selector: 'app-model-breakdown',
  imports: [CommonModule, TranslateModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './model-breakdown.component.html'
})
export class ModelBreakdownComponent implements OnChanges {
  @Input() labels: Record<string, string> = {};
  @Input() labelKey = 'statistics.model';
  @Input() tableTitleKey: string | null = null;
  @Input() exportCounts: Record<string, { pageCount: number; otherModelCount: number }> | null = null;
  @Input() preview = false;
  @Input() showHint = true;
  @Input() counts: ModelStatistic[] = [];
  @Input() titleKey = 'statistics.productivity.byModel';
  @Input() emptyKey = 'statistics.productivity.empty';
  @Output() visibleTotalChange = new EventEmitter<number>();
  readonly translator = inject(TranslateService);
  models: ModelCount[] = [];
  slices: { item: ModelCount; path: string }[] = [];
  total = 0;
  visibleTotal = 0;

  ngOnChanges(): void {
    const hidden = new Set(this.models.filter(item => !item.visible).map(item => item.model));
    this.models = [...this.counts]
      .sort((a, b) => (this.exportCounts
        ? (this.exportCounts[b.model]?.pageCount || 0) - (this.exportCounts[a.model]?.pageCount || 0)
        : b.count - a.count) || a.model.localeCompare(b.model))
      .map(({ model, count }, index) => ({ model, count, visible: !hidden.has(model),
        color: index === 0 ? 'var(--app-color-primary, #456aa5)'
          : `hsl(${(index * 137.508) % 360}, 60%, 43%)` }));
    this.total = this.models.reduce((sum, item) => sum + item.count, 0);
    this.recalculate(false);
  }

  label(model: string): string {
    if (this.labels[model]) return this.labels[model];
    const key = 'model.' + model;
    const label = this.translator.instant(key);
    return label === key ? model : label;
  }

  toggle(item: ModelCount): void {
    item.visible = !item.visible;
    this.recalculate();
  }

  get allVisible(): boolean { return this.models.every(item => item.visible); }

  showAll(): void {
    this.models.forEach(item => item.visible = true);
    this.recalculate();
  }

  private recalculate(notify = true): void {
    this.visibleTotal = this.models.filter(item => item.visible).reduce((sum, item) => sum + item.count, 0);
    if (notify) this.visibleTotalChange.emit(this.visibleTotal);
    let angle = -Math.PI / 2;
    this.slices = this.models.filter(item => item.visible && item.count > 0).map(item => {
      const end = angle + item.count / this.visibleTotal * 2 * Math.PI;
      const point = (value: number) => `${150 + 140 * Math.cos(value)},${150 + 140 * Math.sin(value)}`;
      // Two arcs also handle the case where a single model fills the whole circle.
      const middle = (angle + end) / 2;
      const path = `M150,150 L${point(angle)} A140,140 0 0,1 ${point(middle)} A140,140 0 0,1 ${point(end)} Z`;
      angle = end;
      return { item, path };
    });
  }
}
