import { TranslateService } from '@ngx-translate/core';

export interface ChangeModelProgress {
  totalObjects: number;
  convertedObjects: number;
  failedPid?: string;
  unprocessedPids: string[];
  unprocessedRootPids: string[];
  validation?: string;
}

export function changeModelProgress(response: any): ChangeModelProgress | null {
  const item = response?.response?.data?.[0];
  return typeof item?.totalObjects === 'number' && typeof item?.convertedObjects === 'number'
    ? item as ChangeModelProgress : null;
}

export function changeModelProgressMessages(progress: ChangeModelProgress, translator: TranslateService): string[] {
  const messages = [String(translator.instant('dialog.changeModel.progress', {
    converted: progress.convertedObjects,
    total: progress.totalObjects
  }))];
  if (progress.failedPid) {
    messages.push(String(translator.instant('dialog.changeModel.failedPid', { pid: progress.failedPid })));
  }
  if (progress.unprocessedPids?.length) {
    messages.push(String(translator.instant('dialog.changeModel.unprocessedPids', {
      pids: progress.unprocessedPids.join(', ')
    })));
  }
  if (progress.unprocessedRootPids?.length) {
    messages.push(String(translator.instant('dialog.changeModel.unprocessedRootPids', {
      pids: progress.unprocessedRootPids.join(', ')
    })));
  }
  return messages;
}
