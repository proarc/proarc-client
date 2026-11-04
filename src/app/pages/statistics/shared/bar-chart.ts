export function barChartScale(values: number[], percent: boolean): { maximum: number; ticks: number[] } {
  const total = values.reduce((sum, value) => sum + value, 0);
  const largestValue = values.reduce((maximum, value) => Math.max(maximum, value), 0);
  const largest = percent ? (total > 0 ? largestValue / total * 100 : 1) : Math.max(1, largestValue);
  const roughStep = largest / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const niceStep = [1, 2, 5, 10].find(multiplier => multiplier * magnitude >= roughStep)! * magnitude;
  const step = percent ? niceStep : Math.max(1, niceStep);
  const maximum = Math.ceil(largest / step) * step;
  return { maximum, ticks: Array.from({ length: Math.round(maximum / step) + 1 }, (_, index) => index * step) };
}
