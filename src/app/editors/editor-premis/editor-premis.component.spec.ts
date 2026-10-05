import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, input, output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { TemplateService } from '../../services/template.service';
import { EditorPremisComponent } from './editor-premis.component';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';
import { PremisTemplate } from '../../model/premis.model';

@Component({selector: 'app-editor-switcher', template: ''})
class PremisSwitcherStub {
  panelType = input<string>();
  onChangeEditorType = output<string>();
}

describe('Page PREMIS editor', () => {
  const xml = '<mets xmlns="http://www.loc.gov/METS/"><amdSec><digiprovMD ID="AGENT_001">' +
    '<mdWrap MIMETYPE="text/xml" MDTYPE="PREMIS"><xmlData><p:agent xmlns:p="info:lc/xmlns/premis-v2">' +
    '<p:agentName>Scanner</p:agentName></p:agent></xmlData></mdWrap></digiprovMD></amdSec></mets>';
  let fixture: ComponentFixture<EditorPremisComponent>;
  let editor: EditorPremisComponent;
  let api: jasmine.SpyObj<ApiService>;
  let layout: jasmine.SpyObj<LayoutService>;
  let ui: jasmine.SpyObj<UIService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('ApiService', ['getPremis', 'savePremis']);
    api.getPremis.and.returnValue(of({content: xml, timestamp: -1, status: 0}));
    api.savePremis.and.returnValue(of({status: 0, data: [{timestamp: 42}]}));
    layout = jasmine.createSpyObj('LayoutService', ['setPanelEditing', 'clearPanelEditing']);
    layout.type = 'repo';
    layout.batchId = null;
    ui = jasmine.createSpyObj('UIService', ['showInfoSnackBar', 'showErrorSnackBar', 'showErrorDialogFromObject']);
    TestBed.configureTestingModule({providers: [
      {provide: ApiService, useValue: api}, {provide: LayoutService, useValue: layout},
      {provide: UIService, useValue: ui}, {provide: UserSettings, useValue: new UserSettings()},
      {provide: TemplateService, useValue: {getPremisTemplate: () => of({elements: {}})}},
      {provide: TranslateService, useValue: {instant: (key: string) => key}}
    ]}).overrideComponent(EditorPremisComponent, {set: {template: '', imports: []}});
    fixture = TestBed.createComponent(EditorPremisComponent);
    editor = fixture.componentInstance;
    fixture.componentRef.setInput('pid', 'uuid:page');
    fixture.componentRef.setInput('model', 'model:page');
    fixture.componentRef.setInput('panel', {id: 'panel1', canEdit: true});
  });

  it('loads all three repository page models and does not generate by writing', () => {
    ['model:page', 'model:ndkpage', 'model:oldprintpage'].forEach(model => {
      fixture.componentRef.setInput('model', model);
      fixture.detectChanges();
      expect(editor.state).toBe('success');
      expect(api.getPremis).toHaveBeenCalledWith('uuid:page', null);
      expect(editor.hasChanged()).toBeFalse();
    });
    expect(api.savePremis).not.toHaveBeenCalled();
  });

  it('preserves edits after save errors, then reads the new timestamp after retry', () => {
    fixture.detectChanges();
    editor.premis.groups[0].fields[0].value = 'Changed';
    api.savePremis.and.returnValue(of({status: -1, errors: {path: []}}));
    editor.save();
    expect(editor.state).toBe('success');
    expect(editor.hasChanged()).toBeTrue();
    expect(layout.clearPanelEditing).not.toHaveBeenCalled();
    api.savePremis.and.returnValue(of({status: 0, data: [{timestamp: 42}]}));
    api.getPremis.and.returnValue(of({content: xml.replace('Scanner', 'Changed'), timestamp: 42, status: 0}));
    editor.save();
    expect(api.savePremis.calls.mostRecent().args[2]).toBe(-1);
    expect(editor.premis.timestamp).toBe(42);
    expect(editor.hasChanged()).toBeFalse();
    expect(layout.clearPanelEditing).toHaveBeenCalled();
  });

  it('keeps a late response for the previous page from replacing the selected page', () => {
    const first = new Subject<any>();
    api.getPremis.and.returnValue(first);
    fixture.detectChanges();
    api.getPremis.and.returnValue(of({content: xml, timestamp: 2, status: 0}));
    fixture.componentRef.setInput('pid', 'uuid:second');
    fixture.detectChanges();
    first.next({content: xml, timestamp: 1, status: 0});
    expect(editor.premis.timestamp).toBe(2);
  });

  it('handles missing metadata and direct StringRecord failures', () => {
    api.getPremis.and.returnValue(of({content: null, timestamp: -1, status: 0}));
    fixture.detectChanges();
    expect(editor.state).toBe('empty');
    api.getPremis.and.returnValue(of({status: -1, data: {message: 'No device'}}));
    editor.load();
    expect(editor.state).toBe('failure');
    expect(ui.showErrorDialogFromObject).toHaveBeenCalled();
  });

  it('does not call the API for unsaved pages, unsupported models or Kramerius', () => {
    fixture.componentRef.setInput('notSaved', true);
    fixture.detectChanges();
    expect(editor.state).toBe('unsupported');
    fixture.componentRef.setInput('notSaved', false);
    fixture.componentRef.setInput('model', 'model:ndkaudiopage');
    fixture.detectChanges();
    expect(api.getPremis).not.toHaveBeenCalled();
    layout.type = 'kramerius';
    fixture.componentRef.setInput('model', 'model:page');
    fixture.detectChanges();
    expect(api.getPremis).not.toHaveBeenCalled();
  });

  it('does not submit invalid XML or changes from a disabled panel', () => {
    fixture.componentRef.setInput('panelType', 'premisXML');
    fixture.detectChanges();
    editor.editXml();
    editor.xml = '<broken>';
    editor.save();
    expect(api.savePremis).not.toHaveBeenCalled();
    editor.revert();
    expect(editor.hasChanged()).toBeFalse();
    fixture.componentRef.setInput('panelType', 'premis');
    fixture.detectChanges();
    editor.premis.groups[0].fields[0].value = 'Changed';
    fixture.componentRef.setInput('panel', {id: 'panel1', canEdit: false});
    editor.save();
    expect(api.savePremis).not.toHaveBeenCalled();
  });

  it('blocks import loading even when an old layout contains a PREMIS panel', () => {
    layout.type = 'import';
    layout.batchId = '7';
    fixture.detectChanges();
    expect(editor.state).toBe('unsupported');
    editor.load();
    expect(api.getPremis).not.toHaveBeenCalled();
  });

  it('opens XML read-only, starts editing explicitly and cancels changes', () => {
    fixture.componentRef.setInput('panelType', 'premisXML');
    fixture.detectChanges();
    expect(editor.xmlMode).toBeTrue();
    expect(editor.xmlEditing).toBeFalse();
    editor.editXml();
    expect(editor.xmlEditing).toBeTrue();
    layout.editingPanel = 'panel1';
    const editedXml = xml.replace('Scanner', 'Changed &amp; new');
    editor.xmlChanged({target: {innerText: editedXml}} as unknown as Event);
    expect(editor.xml).toBe(editedXml);
    expect(editor.hasChanged()).toBeTrue();
    expect(layout.setPanelEditing).toHaveBeenCalled();
    const loads = api.getPremis.calls.count();
    editor.refresh();
    expect(api.getPremis.calls.count()).toBe(loads);
    editor.revert();
    expect(editor.xml).toBe(xml);
    expect(editor.xmlEditing).toBeFalse();
    expect(editor.hasChanged()).toBeFalse();
    expect(layout.clearPanelEditing).toHaveBeenCalled();
    editor.refresh();
    expect(api.getPremis.calls.count()).toBe(loads + 1);
  });

  it('saves edited XML and returns to read-only mode with the new server timestamp', () => {
    fixture.componentRef.setInput('panelType', 'premisXML');
    fixture.detectChanges();
    editor.editXml();
    const editedXml = xml.replace('Scanner', 'Changed');
    editor.xmlChanged({target: {innerText: editedXml}} as unknown as Event);
    api.getPremis.and.returnValue(of({content: editedXml, timestamp: 42, status: 0}));
    editor.save();
    expect(api.savePremis).toHaveBeenCalledWith('uuid:page', editedXml, -1, false, null);
    expect(editor.xmlEditing).toBeFalse();
    expect(editor.xmlMode).toBeTrue();
    expect(editor.premis.timestamp).toBe(42);
    expect(editor.hasChanged()).toBeFalse();
  });

  it('keeps XML editing active and preserves changes after a server error', () => {
    fixture.componentRef.setInput('panelType', 'premisXML');
    fixture.detectChanges();
    editor.editXml();
    editor.xmlChanged({target: {innerText: xml.replace('Scanner', 'Changed')}} as unknown as Event);
    api.savePremis.and.returnValue(of({status: -1, errors: {path: []}}));
    editor.save();
    expect(editor.state).toBe('success');
    expect(editor.xmlEditing).toBeTrue();
    expect(editor.hasChanged()).toBeTrue();
  });

  it('blocks saving if an import batch becomes active after loading a repository page', () => {
    fixture.detectChanges();
    editor.premis.groups[0].fields[0].value = 'Changed';
    layout.batchId = '7';
    editor.save();
    expect(api.savePremis).not.toHaveBeenCalled();
    layout.batchId = null;
    layout.type = 'import';
    editor.save();
    expect(api.savePremis).not.toHaveBeenCalled();
  });
});

describe('PREMIS nested form rendering', () => {
  let template: PremisTemplate;
  let fixture: ComponentFixture<EditorPremisComponent>;

  beforeAll(async () => {
    template = await (await fetch('/assets/templates/premis/premis.template.json6')).json();
  });

  beforeEach(async () => {
    const xml = '<mets xmlns="http://www.loc.gov/METS/"><amdSec><techMD ID="OBJ_001">' +
      '<mdWrap MIMETYPE="text/xml" MDTYPE="PREMIS"><xmlData>' +
      '<p:object xmlns:p="info:lc/xmlns/premis-v2"><p:objectCharacteristics><p:fixity>' +
      '<p:messageDigestAlgorithm>SHA-256</p:messageDigestAlgorithm></p:fixity></p:objectCharacteristics>' +
      '<p:originalName>page.xml</p:originalName></p:object></xmlData></mdWrap></techMD></amdSec></mets>';
    TestBed.configureTestingModule({imports: [TranslateModule.forRoot()], providers: [
      provideNoopAnimations(),
      {provide: ApiService, useValue: {getPremis: () => of({content: xml, timestamp: 1, status: 0})}},
      {provide: TemplateService, useValue: {getPremisTemplate: () => of(template)}},
      {provide: LayoutService, useValue: {type: 'repo', batchId: null,
        setPanelEditing: jasmine.createSpy('setPanelEditing'), clearPanelEditing: jasmine.createSpy('clearPanelEditing')}},
      {provide: UIService, useValue: {}}, {provide: UserSettings, useValue: new UserSettings()}
    ]}).overrideComponent(EditorPremisComponent, {
      remove: {imports: [EditorSwitcherComponent]}, add: {imports: [PremisSwitcherStub]}
    });
    fixture = TestBed.createComponent(EditorPremisComponent);
    fixture.componentRef.setInput('pid', 'uuid:page');
    fixture.componentRef.setInput('model', 'model:page');
    fixture.componentRef.setInput('panel', {id: 'premis', canEdit: true});
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('adds a sibling Fixity using its plus with its scalar inputs immediately editable', async () => {
    const host: HTMLElement = fixture.nativeElement;
    const initialInputs = host.querySelectorAll('input').length;
    const fixity = host.querySelector('.app-premis-nested .app-premis-nested');
    expect(fixity.textContent).toContain('Fixity');
    expect((fixity.querySelector('input') as HTMLInputElement).value).toBe('SHA-256');
    (fixity.querySelector('button[aria-label="common.add: Fixity"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    const editor = fixture.componentInstance;
    const characteristics = editor.premis.roots[0].children[0];
    expect(characteristics.children.map(group => group.node.localName)).toEqual(['fixity', 'fixity']);
    expect(characteristics.children[0].children.length).toBe(0);
    expect(characteristics.children[0].fields[0].value).toBe('SHA-256');
    expect(characteristics.children[1].fields.length).toBe(3);
    expect(fixity.querySelectorAll('input').length).toBe(3);
    const digest = Array.from(fixity.querySelectorAll<HTMLInputElement>('input'))
      .find(input => input.closest('mat-form-field').textContent.includes('Message Digest') &&
        !input.closest('mat-form-field').textContent.includes('Algorithm') &&
        !input.closest('mat-form-field').textContent.includes('Originator'));
    digest.value = 'abc123';
    digest.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(characteristics.children[0].fields.find(field => field.label === 'Message Digest').value).toBe('abc123');
    expect(characteristics.children[1].fields.every(field => field.value === '')).toBeTrue();
    expect(fixture.componentInstance.hasChanged()).toBeTrue();
    fixture.componentInstance.revert();
    fixture.detectChanges();
    expect(host.querySelectorAll('input').length).toBe(initialInputs);
    expect(fixture.componentInstance.hasChanged()).toBeFalse();
  });

  it('offers Type and Value inputs immediately after adding Linking Rights Statement Identifier', async () => {
    const editor = fixture.componentInstance;
    const host: HTMLElement = fixture.nativeElement;
    (host.querySelector('button[aria-label="common.add: Linking Rights Statement Identifier"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    const group = editor.premis.roots[0].children.find(item => item.node.localName === 'linkingRightsStatementIdentifier');
    const form = Array.from(host.querySelectorAll<HTMLElement>('.app-form')).find(element =>
      element.querySelector(':scope > .app-form-header .app-form-title')?.textContent.trim() === 'Linking Rights Statement Identifier');
    const inputs = form.querySelectorAll<HTMLInputElement>('input');
    expect(inputs.length).toBe(2);
    inputs[0].value = 'local';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'rights:123';
    inputs[1].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(group.fields.map(field => field.value)).toEqual(['local', 'rights:123']);
    const document = new DOMParser().parseFromString(editor.premis.serialize(), 'application/xml');
    const node = document.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'linkingRightsStatementIdentifier')[0];
    expect(Array.from(node.children).map(child => child.textContent)).toEqual(['local', 'rights:123']);
    expect(group.children.length).toBe(0);
  });

  it('displays the newly allocated METS ID after adding a top-level Object', async () => {
    const editor = fixture.componentInstance;
    const host: HTMLElement = fixture.nativeElement;
    (host.querySelector('button[aria-label="common.add: OBJ_001 / Object"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(editor.premis.roots[1].label).toBe('OBJ_002 / Object');
    expect(host.textContent).toContain('OBJ_002 / Object');
    const document = new DOMParser().parseFromString(editor.premis.serialize(), 'application/xml');
    expect(Array.from(document.getElementsByTagNameNS('http://www.loc.gov/METS/', 'techMD'))
      .map(element => element.getAttribute('ID'))).toEqual(['OBJ_001', 'OBJ_002']);
    editor.removeGroup(editor.premis.roots[1]);
    expect(editor.hasChanged()).toBeFalse();
  });

  it('shows absent groups at their own level without changing the XML until their plus is clicked', () => {
    const editor = fixture.componentInstance;
    const host: HTMLElement = fixture.nativeElement;
    expect(editor.hasChanged()).toBeFalse();
    (host.querySelector('button[aria-label="common.add: Object Identifier"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    const object = editor.premis.roots[0];
    const identifier = object.children.find(group => group.node.localName === 'objectIdentifier');
    expect(identifier).toBeDefined();
    expect(identifier.children.length).toBe(0);
    expect(host.querySelector('button[aria-label="common.add: Object Identifier Type"]')).not.toBeNull();
    expect(host.querySelector('button[aria-label="common.add: Object Identifier Value"]')).not.toBeNull();
  });

  it('disables adding, removing and text editing for a read-only panel', async () => {
    fixture.componentRef.setInput('panel', {id: 'premis', canEdit: false});
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    expect(Array.from(host.querySelectorAll<HTMLInputElement>('input')).every(input => input.disabled)).toBeTrue();
    expect(Array.from(host.querySelectorAll<HTMLButtonElement>('button[aria-label^="common.add"], button[aria-label^="common.remove"]'))
      .every(button => button.disabled)).toBeTrue();
    const editor = fixture.componentInstance;
    const group = editor.premis.roots[0];
    editor.addElement(group, editor.premis.availableElements(group)[0]);
    editor.removeGroup(group.children[0]);
    editor.removeField(group, group.fields[0]);
    expect(editor.hasChanged()).toBeFalse();
  });
});
