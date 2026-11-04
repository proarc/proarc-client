export interface PieLabel {
  item: { model: string; color: string };
  right: boolean;
  y: number;
  points: string;
}

export function buildPieLabels<T extends { model: string; color: string }>(
  slices: { item: T; middle: number }[], count: (item: T) => number
): PieLabel[] {
  const labels = [...slices].sort((a, b) => count(b.item) - count(a.item)).slice(0, 5)
    .map(({ item, middle }) => ({ item, right: Math.cos(middle) >= 0,
      x: 150 + 140 * Math.cos(middle), y: 150 + 140 * Math.sin(middle), points: '' }));
  for (const right of [false, true]) {
    const side = labels.filter(label => label.right === right).sort((a, b) => a.y - b.y);
    let previousY = -24;
    for (let index = 0; index < side.length; index++) {
      const label = side[index];
      // Reserve space for wrapped names, including several tiny neighbouring slices.
      const y = Math.max(previousY + 54, Math.min(label.y, 270 - (side.length - index - 1) * 54));
      label.points = `${label.x},${label.y} ${right ? 300 : 0},${y} ${right ? 316 : -16},${y}`;
      label.y = y;
      previousY = y;
    }
  }
  return labels;
}
