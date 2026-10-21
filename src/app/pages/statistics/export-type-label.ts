/** Use the same profile names as process management, retaining unknown profile IDs. */
export function exportTypeLabel(type: string | null, translate: (key: string) => string): string {
  if (!type) return translate('statistics.exports.unknownType');
  const key = 'formField.profiles.' + type;
  const label = translate(key);
  return label === key ? type : label;
}
