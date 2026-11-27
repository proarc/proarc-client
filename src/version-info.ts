export const versionInfo = (() => {
  // try {
  //   // tslint:disable-next-line:no-var-requires
  //   return require('../git-version.json');
  // } catch {
  // In dev the file might not exist:
  return { tag: 'v2.4.15', hash: 'prod', date: '2026-11-27' };
  // }
})();
