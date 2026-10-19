import { signal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { Batch } from '../../model/batch.model';
import { ProcessManagementComponent } from './process-management.component';

describe('Process management selection actions', () => {
  let component: ProcessManagementComponent;
  let api: jasmine.SpyObj<any>;
  let ui: jasmine.SpyObj<any>;

  function batch(id: number, state = 'LOADING', selected = true): Batch {
    return Object.assign(new Batch(), { id, state, selected, user: 'tester', userId: 1 });
  }

  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['stopBatch', 'reExportBatch', 'retryCatalogUpdate']);
    ui = jasmine.createSpyObj('ui', ['showErrorDialogFromObject']);
    component = new ProcessManagementComponent(null, {
      user: { name: 'tester', userId: 1, importToCatalogFunction: true }
    } as any, api, ui, null, null, null, null, null, null, null, null);
    component.totalSelected = signal(0);
    spyOn(component, 'reloadBatches');
  });

  it('keeps the remaining row as the single selection after Ctrl deselection', () => {
    const first = batch(1);
    const second = batch(2);
    component.batches = [first, second];
    component.selectRow({ item: second, idx: 1, event: new MouseEvent('click', { ctrlKey: true }) });
    expect(component.totalSelected()).toBe(1);
    expect(component.selectedBatch).toBe(first);
    component.selectRow({ item: first, idx: 0, event: new MouseEvent('click', { ctrlKey: true }) });
    expect(component.totalSelected()).toBe(0);
    expect(component.selectedBatch).toBeNull();
  });

  it('hides single-row actions when multiple rows are selected', () => {
    component.batches = [batch(1), batch(2, 'LOADING', false)];
    component.selectRow({ item: component.batches[1], idx: 1, event: new MouseEvent('click', { ctrlKey: true }) });
    expect(component.totalSelected()).toBe(2);
    expect(component.selectedBatch).toBeNull();
  });

  it('requires every selected process to support the action', () => {
    component.batches = [batch(1), batch(2, 'INGESTED')];
    expect(component.canStopSelected()).toBeFalse();
    component.onStopSelected();
    expect(api.stopBatch).not.toHaveBeenCalled();
    component.batches[1].selected = false;
    expect(component.canStopSelected()).toBeTrue();
    component.batches[0].selected = false;
    expect(component.canStopSelected()).toBeFalse();
  });

  it('prevents actions on the old selection while the list is being reloaded', () => {
    component.batches = [batch(1)];
    component.state = 'loading';
    component.onStopSelected();
    expect(api.stopBatch).not.toHaveBeenCalled();
  });

  it('stops only selected processes and refreshes after all requests finish', () => {
    component.batches = [batch(1), batch(2), batch(3, 'LOADING', false)];
    const first = new Subject<any>();
    const second = new Subject<any>();
    api.stopBatch.and.callFake((id: number) => id === 1 ? first : second);
    component.onStopSelected();
    expect(api.stopBatch.calls.allArgs()).toEqual([[1], [2]]);
    expect(component.canStopSelected()).toBeFalse();
    component.onStopSelected();
    expect(api.stopBatch).toHaveBeenCalledTimes(2);
    first.next({ response: {} });
    first.complete();
    expect(component.reloadBatches).not.toHaveBeenCalled();
    second.next({ response: {} });
    second.complete();
    expect(component.reloadBatches).toHaveBeenCalledTimes(1);
    expect(component.actionPending).toBeFalse();
  });

  it('reports a failed request while completing the other selected processes', () => {
    component.batches = [batch(1), batch(2)];
    api.stopBatch.and.callFake((id: number) => id === 1
      ? throwError(() => new Error('Network error')) : of({ response: {} }));
    component.onStopSelected();
    expect(api.stopBatch).toHaveBeenCalledTimes(2);
    expect(ui.showErrorDialogFromObject).toHaveBeenCalledWith([{ errorMessage: 'Network error' }]);
    expect(component.reloadBatches).toHaveBeenCalledTimes(1);
    expect(component.actionPending).toBeFalse();
  });

  it('respects catalog permissions for the entire selection', () => {
    component.batches = [batch(1, 'INTERNAL_FAILED'), batch(2, 'STOPPED')];
    component.batches.forEach(item => item.profile = 'internalProfile.updateCatalogRecords');
    expect(component.canRetrySelectedCatalogUpdates()).toBeTrue();
    component.batches[1].userId = 2;
    expect(component.canRetrySelectedCatalogUpdates()).toBeFalse();
  });

  it('offers reexport only for a selection of failed or stopped exports', () => {
    component.batches = [batch(1, 'EXPORT_FAILED'), batch(2, 'STOPPED')];
    component.batches.forEach(item => item.profile = 'exportProfile.ndk');
    expect(component.canReexportSelected()).toBeTrue();
    component.batches[1].profile = 'profile.default_ndk_import';
    expect(component.canReexportSelected()).toBeFalse();
  });
});
