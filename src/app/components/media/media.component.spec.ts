import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { MediaComponent } from './media.component';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { DocumentItem } from '../../model/documentItem.model';

describe('Media selection upload', () => {
  let fixture: ComponentFixture<MediaComponent>;
  let component: MediaComponent;
  let selected: DocumentItem[];
  let api: jasmine.SpyObj<ApiService>;
  let ui: jasmine.SpyObj<UIService>;
  const article = (pid: string, model = 'model:ndkearticle') => DocumentItem.fromJson({pid, model});

  beforeEach(async () => {
    selected = [article('uuid:1'), article('uuid:2')];
    api = jasmine.createSpyObj('ApiService', ['getStreamProfile', 'uploadFileToObjects']);
    api.getStreamProfile.and.returnValue(of({response: {data: []}}));
    ui = jasmine.createSpyObj('UIService', ['showErrorDialogFromString', 'showInfoSnackBar']);
    await TestBed.configureTestingModule({
      imports: [MediaComponent],
      providers: [
        {provide: ApiService, useValue: api}, {provide: UIService, useValue: ui},
        {provide: LayoutService, useValue: {type: 'repo', getSelected: () => selected}},
        {provide: MatDialog, useValue: {}}, {provide: UserSettings, useValue: {}},
        {provide: TranslateService, useValue: {instant: (key: string, params: any) => key + JSON.stringify(params)}}
      ]
    }).overrideComponent(MediaComponent, {set: {template: '', imports: []}}).compileComponents();
    fixture = TestBed.createComponent(MediaComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lastSelectedItem', selected[0]);
    fixture.componentRef.setInput('numOfSelected', selected.length);
    fixture.detectChanges();
    component.pdfInput = new ElementRef({value: '', click: jasmine.createSpy('click')});
  });

  it('rejects mixed unsupported models, unsaved objects and import batches', () => {
    expect(component.canUpload()).toBeTrue();
    selected[1].model = 'model:ndkpage';
    expect(component.canUpload()).toBeFalse();
    selected[1].model = 'model:ndkearticle';
    selected[1].notSaved = true;
    expect(component.canUpload()).toBeFalse();
    selected[1].notSaved = false;
    component.isRepo = false;
    expect(component.canUpload()).toBeFalse();
  });

  it('keeps a locked panel upload targeted at its displayed object', () => {
    component.changeLockPanel();
    expect(component.uploadItems().map(item => item.pid)).toEqual(['uuid:1']);
    component.changeLockPanel();
    expect(component.uploadItems().length).toBe(2);
  });

  it('freezes the targets when opening the picker and reports partial failure', () => {
    const results = new Subject<{pid: string, response: any}>();
    api.uploadFileToObjects.and.returnValue(results);
    component.onAddPdf();
    selected = [article('uuid:3')];
    fixture.componentRef.setInput('lastSelectedItem', selected[0]);
    fixture.componentRef.setInput('numOfSelected', 1);
    fixture.detectChanges();
    const file = new File(['%PDF'], 'article.PDF');
    const target = {files: [file], value: 'article.PDF'};
    component.uploadFile({target});
    expect(api.uploadFileToObjects).toHaveBeenCalledWith(file, ['uuid:1', 'uuid:2'], 'application/pdf');
    expect(component.uploading).toBeTrue();
    expect(component.canUpload()).toBeFalse();
    results.next({pid: 'uuid:1', response: {response: {status: 0}}});
    results.next({pid: 'uuid:2', response: {response: {status: -1, errorMessage: 'Locked'}}});
    results.complete();
    expect(component.uploading).toBeFalse();
    expect(component.uploadCompleted).toBe(2);
    expect(target.value).toBe('');
    expect(ui.showInfoSnackBar).not.toHaveBeenCalled();
    expect(ui.showErrorDialogFromString.calls.mostRecent().args[0]).toContain('uuid:2');
    expect(api.getStreamProfile).toHaveBeenCalledWith('uuid:3');
  });

  it('rejects EPUB for multiple objects', () => {
    component.onAddPdf();
    component.uploadFile({target: {files: [new File(['epub'], 'article.epub')], value: 'article.epub'}});
    expect(api.uploadFileToObjects).not.toHaveBeenCalled();
    expect(ui.showErrorDialogFromString).toHaveBeenCalled();
  });
});
