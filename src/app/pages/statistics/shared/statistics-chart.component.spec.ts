import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StatisticsChartComponent } from './statistics-chart.component';
import { barChartScale } from './bar-chart';

describe('StatisticsChartComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [StatisticsChartComponent, TranslateModule.forRoot()] });
    TestBed.inject(TranslateService).use('en');
  });

  function createChart() {
    const fixture = TestBed.createComponent(StatisticsChartComponent);
    fixture.componentRef.setInput('slices', [
      { item: { model: 'first', color: '#456aa5', count: 30, chartCount: 5 } },
      { item: { model: 'second', color: '#55aa44', count: 90, chartCount: 15 } }
    ]);
    fixture.detectChanges();
    const clickToggle = (index: number) => {
      (fixture.nativeElement.querySelectorAll('mat-button-toggle button')[index] as HTMLButtonElement).click();
      fixture.detectChanges();
    };
    return { fixture, clickToggle };
  }

  it('starts with a pie and switches to absolute bars, then percentages of visible objects', () => {
    const { fixture, clickToggle } = createChart();
    expect(fixture.nativeElement.querySelector('.bar-chart')).toBeNull();
    clickToggle(1);
    expect(fixture.nativeElement.querySelectorAll('rect').length).toBe(2);
    expect(fixture.nativeElement.querySelector('rect title').textContent).toContain('30');
    expect(fixture.nativeElement.querySelector('rect').getAttribute('aria-label')).toContain('30');
    clickToggle(3);
    expect(fixture.nativeElement.querySelector('rect').getAttribute('aria-label')).toContain('25.0%');
    expect(Number(fixture.nativeElement.querySelector('rect').getAttribute('height'))).toBe(78.125);
    expect(fixture.componentInstance.ticks.at(-1)?.value).toBe(80);
    clickToggle(0);
    expect(fixture.nativeElement.querySelector('.bar-chart')).toBeNull();
  });

  it('uses the selected export metric and preserves hiding through mouse and keyboard', () => {
    const { fixture, clickToggle } = createChart();
    fixture.componentRef.setInput('valueKey', 'chartCount');
    fixture.detectChanges();
    clickToggle(1);
    const clicked = spyOn(fixture.componentInstance.modelClick, 'emit');
    const firstBar = fixture.nativeElement.querySelector('rect') as SVGRectElement;
    expect(firstBar.getAttribute('aria-label')).toContain('5');
    firstBar.dispatchEvent(new MouseEvent('click'));
    firstBar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(clicked).toHaveBeenCalledTimes(2);
    expect(clicked.calls.mostRecent().args[0].model).toBe('first');
    clickToggle(3);
    fixture.componentRef.setInput('slices', [
      { item: { model: 'second', color: '#55aa44', count: 90, chartCount: 15 } }
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('rect').getAttribute('aria-label')).toContain('100.0%');
  });

  it('handles empty data without invalid SVG values', () => {
    const { fixture, clickToggle } = createChart();
    clickToggle(1);
    fixture.componentRef.setInput('slices', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.bar-chart')).toBeNull();
  });
});

describe('barChartScale', () => {
  it('uses integer ticks covering small and large absolute counts', () => {
    for (const values of [[], [1], [3], [771, 769, 190], [123456789]]) {
      const scale = barChartScale(values, false);
      expect(scale.maximum).toBeGreaterThanOrEqual(Math.max(1, ...values));
      expect(scale.ticks[0]).toBe(0);
      expect(scale.ticks.every(Number.isInteger)).toBeTrue();
    }
  });

  it('scales the percentage axis to the highest visible share', () => {
    expect(barChartScale([30, 90], true)).toEqual({ maximum: 80, ticks: [0, 20, 40, 60, 80] });
    expect(barChartScale([40, 30, 20, 10], true)).toEqual({ maximum: 40, ticks: [0, 10, 20, 30, 40] });
    expect(barChartScale([15], true).maximum).toBe(100);
  });

  it('supports fractional percentage ticks for many small shares and empty data', () => {
    const scale = barChartScale(Array(1000).fill(1), true);
    expect(scale.maximum).toBeCloseTo(0.1);
    expect(scale.ticks[1]).toBeLessThan(1);
    expect(barChartScale([], true).maximum).toBeGreaterThan(0);
  });
});
