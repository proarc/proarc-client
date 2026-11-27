export const versionInfo = (() => {
  // try {
  //   // tslint:disable-next-line:no-var-requires
  //   return require('../git-version.json');
  // } catch {
    // In dev the file might not exist:
    return { tag: '2.5.8-DEV', hash: 'prod', date: '2026-11-27' };
  // }
})();
