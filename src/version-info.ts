export const versionInfo = (() => {
  try {
    // tslint:disable-next-line:no-var-requires
    return require('../git-version.json');
  } catch {
    // In dev the file might not exist:
    return { tag: 'v2.0.2', hash: 'draft', date: new Date()};
  }
})();
