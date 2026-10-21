/** Two-column CSV with Excel-compatible UTF-8 encoding and semicolon separators. */
export function buildStatisticsCsv(title: string, filters: string, modelHeader: string, countHeader: string,
  rows: { model: string; count: number }[]): string {
  return buildTabularStatisticsCsv(title, filters, [modelHeader, countHeader], rows.map(row => [row.model, row.count]));
}

export function buildTabularStatisticsCsv(title: string, filters: string, headers: string[], rows: (string | number)[][]): string {
  const cell = (value: string | number): string => {
    if (typeof value === 'number') return String(value);
    // Keep model labels as text when opening the CSV in a spreadsheet.
    const text = /^[\s]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? "'" + value : value;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ');
  return '\uFEFF' + [
    [singleLine(title), ...headers.slice(1).map(() => '')],
    [singleLine(filters), ...headers.slice(1).map(() => '')],
    headers,
    ...rows
  ].map(row => row.map(cell).join(';')).join('\r\n') + '\r\n';
}
