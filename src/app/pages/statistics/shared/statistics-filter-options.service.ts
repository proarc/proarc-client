import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { ExportOptions } from '../../../model/export-statistic.model';
import { SOFTWARE_MODELS } from '../../../model/software.model';
import { ApiService } from '../../../services/api.service';
import { Configuration } from '../../../shared/configuration';

export interface StatisticsFilterOptions {
  options: ExportOptions;
  deviceLabels: Record<string, string>;
  softwareLabels: Record<string, string>;
  incomplete: boolean;
}

/** Equipment uses the same catalogs as import; other filters include historical values. */
@Injectable({ providedIn: 'root' })
export class StatisticsFilterOptionsService {
  private readonly api = inject(ApiService);
  private readonly config = inject(Configuration);

  load(includeExportHistory: boolean, respectOrganization = false, articles = false): Observable<StatisticsFilterOptions> {
    const empty: ExportOptions = { user: [], model: [], device: [], software: [], exportType: [], sigla: [] };
    return forkJoin({
      users: this.safe(this.api.getUsers(), []),
      devices: this.safe(this.api.getDevices(), []),
      software: this.safe(this.api.getAllSoftware(SOFTWARE_MODELS.set), []),
      history: includeExportHistory ? this.safe(this.api.getExportStatisticsOptions(respectOrganization, articles), empty)
        : of({ value: empty, incomplete: false })
    }).pipe(map(result => {
      const history = result.history.value;
      const software = result.software.value;
      const union = (...parts: string[][]) => [...new Set(parts.flat().filter(value => !!value && !!value.trim()))]
        .sort((a, b) => a.localeCompare(b));
      const deviceLabels = Object.fromEntries(result.devices.value.map(item => [item.id, item.label || item.id]));
      const softwareLabels = Object.fromEntries(software.map(item => [item.id, item.label || item.id]));
      return {
        options: {
          user: union(result.users.value.map(user => user.name), history.user),
          model: union(this.config.models || [], history.model).filter(model => model.startsWith('model:')),
          device: result.devices.value.map(item => item.id),
          software: software.map(item => item.id),
          exportType: union(history.exportType),
          sigla: union(history.sigla || [])
        },
        deviceLabels, softwareLabels,
        incomplete: result.users.incomplete || result.devices.incomplete || result.history.incomplete
          || result.software.incomplete
      };
    }));
  }

  private safe<T>(source: Observable<T>, fallback: T): Observable<{ value: T; incomplete: boolean }> {
    return source.pipe(map(value => ({ value, incomplete: false })),
      catchError(() => of({ value: fallback, incomplete: true })));
  }
}
