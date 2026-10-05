import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { EditorAtmMultipleComponent } from './editor-atm-multiple.component';

describe('Bulk ATM editor', () => {
  let editor: EditorAtmMultipleComponent;
  let api: jasmine.SpyObj<ApiService>;
  let layout: jasmine.SpyObj<LayoutService>;
  let selection: ReplaySubject<boolean>;
  let selected: { pid: string }[];

  beforeEach(() => {
    selection = new ReplaySubject<boolean>(1);
    selected = [{ pid: 'uuid:first' }, { pid: 'uuid:second' }];
    api = jasmine.createSpyObj('ApiService', ['getDevices', 'getAllSoftware', 'editAtmDevices', 'regeneratePremis']);
    api.getDevices.and.returnValue(of([]));
    api.getAllSoftware.and.returnValue(of([]));
    api.editAtmDevices.and.returnValue(of({ response: { status: 0 } }));
    api.regeneratePremis.and.returnValue(of({ response: { status: 0 } }));
    layout = jasmine.createSpyObj('LayoutService', ['selectionChanged', 'getSelected', 'setPanelEditing', 'clearPanelEditing']);
    layout.selectionChanged.and.returnValue(selection);
    layout.getSelected.and.callFake(() => selected as any);
    layout.batchId = '42';
    const ui = jasmine.createSpyObj('UIService', ['showInfoSnackBar', 'showErrorDialogFromObject']);
    const translator = jasmine.createSpyObj('TranslateService', ['instant']);
    TestBed.configureTestingModule({});
    editor = TestBed.runInInjectionContext(() => new EditorAtmMultipleComponent(
      layout, new UserSettings(), api, ui, translator));
    selection.next(true);
    editor.ngOnInit();
  });

  it('saves the full selection and resets changes after success', () => {
    editor.software = 'software:new';
    editor.onSave();
    expect(api.editAtmDevices).toHaveBeenCalledOnceWith(
      ['uuid:first', 'uuid:second'], null, 'software:new', '42');
    expect(editor.hasChanged()).toBeFalse();
  });

  it('discards pending values when the selection changes with the same count', () => {
    editor.device = 'device:new';
    selected = [{ pid: 'uuid:third' }, { pid: 'uuid:fourth' }];
    selection.next(true);
    expect(editor.hasChanged()).toBeFalse();
    editor.software = 'software:new';
    editor.onSave();
    expect(api.editAtmDevices).toHaveBeenCalledOnceWith(
      ['uuid:third', 'uuid:fourth'], null, 'software:new', '42');
  });

  it('keeps edits after an API error so they can be retried', () => {
    api.editAtmDevices.and.returnValue(of({ response: { status: -1, errors: { path: [] } } }));
    editor.device = 'device:new';
    editor.onSave();
    expect(editor.device).toBe('device:new');
    expect(editor.state).toBe('success');
  });

  it('does not save an unchanged form', () => {
    editor.onSave();
    expect(api.editAtmDevices).not.toHaveBeenCalled();
  });

  it('regenerates PREMIS for the complete selection after saving software', () => {
    layout.type = 'repo';
    layout.batchId = null;
    editor.software = 'software:new';
    editor.regeneratePremis();
    expect(api.regeneratePremis).not.toHaveBeenCalled();
    editor.onSave();
    editor.regeneratePremis();
    expect(api.regeneratePremis).toHaveBeenCalledOnceWith(['uuid:first', 'uuid:second'], null);
    expect(editor.state).toBe('success');
  });

  it('does not regenerate PREMIS in an import batch', () => {
    layout.type = 'import';
    editor.regeneratePremis();
    expect(api.regeneratePremis).not.toHaveBeenCalled();
  });
});
