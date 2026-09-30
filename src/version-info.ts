export const versionInfo = (() => {
  // try {
  //   // tslint:disable-next-line:no-var-requires
  //   return require('../git-version.json');
  // } catch {
    // In dev the file might not exist:
    return { tag: '2.5.4-STANDARDY', hash: 'dev', date: '2026-09-30' };
  // }
})();
