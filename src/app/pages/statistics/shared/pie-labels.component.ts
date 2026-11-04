import { Component, Input, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PieLabel } from './pie-labels';

@Component({
  selector: 'g[app-pie-labels]',
  template: `
    @for (callout of callouts; track callout.item.model) {
      <svg:polyline [attr.points]="callout.points" [attr.stroke]="callout.item.color" />
      <svg:foreignObject [attr.x]="callout.right ? 322 : -124" [attr.y]="callout.y - 25" width="102" height="50">
        <div xmlns="http://www.w3.org/1999/xhtml" class="pie-label" [class.pie-label-right]="callout.right">
          {{ label(callout.item.model) }}
        </div>
      </svg:foreignObject>
    }
  `,
  styles: `
    :host { pointer-events: none; }
    polyline { fill: none; stroke-width: 1; vector-effect: non-scaling-stroke; }
    .pie-label {
      display: flex; align-items: center; justify-content: flex-end; height: 100%;
      font-size: 14px; line-height: 16px; overflow-wrap: anywhere; text-align: right;
    }
    .pie-label-right { justify-content: flex-start; text-align: left; }
  `
})
export class PieLabelsComponent {
  @Input() callouts: PieLabel[] = [];
  @Input() labels: Record<string, string> = {};
  private readonly translator = inject(TranslateService);

  label(model: string): string {
    if (this.labels[model]) return this.labels[model];
    const key = 'model.' + model;
    const label = this.translator.instant(key);
    return label === key ? model : label;
  }
}
