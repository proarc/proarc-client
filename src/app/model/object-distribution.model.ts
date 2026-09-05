import { DocumentItem } from './documentItem.model';

export type ObjectDistributionMode = 'pageType' | 'pageRepre';

export interface ObjectDistributionTarget {
  dstPid: string;
  pid: string[];
}

export interface ObjectDistributionRequest {
  srcPid: string;
  runReindex: boolean;
  targets: ObjectDistributionTarget[];
}

export function splitDistributionPages(
  pages: DocumentItem[],
  mode: ObjectDistributionMode,
  pageType = 'titlePage'
): DocumentItem[][] {
  if (!pages.length) {
    return [];
  }

  const groups: DocumentItem[][] = [[pages[0]]];
  for (const page of pages.slice(1)) {
    const startsGroup = mode === 'pageType'
      ? page.pageType === pageType
      : page.pageRepre === 'reprePage';
    if (startsGroup) {
      groups.push([]);
    }
    groups[groups.length - 1].push(page);
  }
  return groups;
}

export function buildObjectDistributionRequest(
  srcPid: string,
  runReindex: boolean,
  targets: DocumentItem[],
  groups: DocumentItem[][]
): ObjectDistributionRequest {
  return {
    srcPid,
    runReindex,
    targets: targets.map((target, index) => ({
      dstPid: target.pid,
      pid: (groups[index] || []).map(page => page.pid)
    }))
  };
}

export function validateObjectDistribution(
  srcPid: string,
  pages: DocumentItem[],
  targets: DocumentItem[],
  groups: DocumentItem[][]
): string | null {
  if (!srcPid) {
    return 'sourceRequired';
  }
  if (!pages.length) {
    return 'pagesRequired';
  }
  if (!targets.length) {
    return 'targetsRequired';
  }
  if (targets.some(target => target.pid === srcPid)) {
    return 'sourceIsTarget';
  }
  if (new Set(targets.map(target => target.pid)).size !== targets.length) {
    return 'duplicateTargets';
  }
  if (groups.length !== targets.length) {
    return 'groupCount';
  }
  if (groups.some(group => group.length === 0)) {
    return 'emptyGroup';
  }
  return null;
}
