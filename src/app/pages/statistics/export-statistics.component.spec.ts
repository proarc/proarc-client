import { TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ExportStatisticsComponent } from './export-statistics.component';
import { StatisticsCsvService } from './statistics-csv.service';
import { StatisticsFilterOptionsService } from './statistics-filter-options.service';

describe('Export statistics display', () => {
  let component: ExportStatisticsComponent;
  let api: jasmine.SpyObj<ApiService>;
  beforeEach(() => {
    api = jasmine.createSpyObj('ApiService', ['getExportStatistics', 'getPackageExportStatistics']);
    api.getExportStatistics.and.callFake((filters: any) => of({ filters, groups: [], count: 0, pageCount: 0, otherModelCount: 0, incompleteCount: 0 }));
    api.getPackageExportStatistics.and.callFake((filters: any, org: boolean, offset = 0) => of({ filters, packages: [], count: 101, offset, limit: 50 }));
    TestBed.configureTestingModule({ providers: [
      { provide: ApiService, useValue: api }, { provide: DateAdapter, useValue: {} },
      { provide: MatDatepickerIntl, useValue: {} }, { provide: TranslateService, useValue: {} },
      { provide: StatisticsCsvService, useValue: {} }, { provide: StatisticsFilterOptionsService, useValue: {} }
    ] });
    component = TestBed.runInInjectionContext(() => new ExportStatisticsComponent());
  });
  it('defaults to NDK and uses the same applied filters in the chart and package table', () => {
    expect(component.selectedTypes).toEqual(['exportProfile.ndk']);
    component.selectedUsers = ['actor']; component.selectedDevices = ['scanner']; component.selectedSoftware = ['suite'];
    component.selectedSiglas = ['ABA001']; component.respectOrganization = true;
    component.load();
    const applied = api.getExportStatistics.calls.mostRecent().args[0];
    component.selectedUsers = ['unapplied edit']; component.respectOrganization = false;
    component.setViewMode('table');
    expect(api.getPackageExportStatistics).toHaveBeenCalledWith(applied, true, 0);
    component.loadPackages(50);
    expect(api.getPackageExportStatistics).toHaveBeenCalledWith(applied, true, 50);
    component.setViewMode('chart'); component.setViewMode('table');
    expect(api.getPackageExportStatistics.calls.count()).toBe(2);
  });
  it('recalculates the table with new filters from the first page', () => {
    component.load(); component.setViewMode('table'); component.loadPackages(50);
    component.selectedTypes = []; component.unique = false; component.load();
    const applied = api.getExportStatistics.calls.mostRecent().args[0];
    expect(applied.unique).toBeFalse(); expect(applied.exportTypes).toEqual([]);
    expect(api.getPackageExportStatistics).toHaveBeenCalledWith(applied, false, 0);
    expect(component.packageResult?.offset).toBe(0);
  });
});
