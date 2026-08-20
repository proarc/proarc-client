export const versionInfo = (() => {
  // try {
  //   // tslint:disable-next-line:no-var-requires
  //   return require('../git-version.json');
  // } catch {
    // In dev the file might not exist:
    return { tag: '2.5.0', hash: 'dev', date: '2026-08-20' };
  // }
})();
