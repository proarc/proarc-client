export const versionInfo = (() => {
  // try {
    // tslint:disable-next-line:no-var-requires
    // return require('../git-version.json');
  // } catch {
    // In dev the file might not exist:
    return { tag: 'v2.2-PLUS', hash: 'dev', date: '2023-10-30T12:00:00.000Z' };
  // }
})();
