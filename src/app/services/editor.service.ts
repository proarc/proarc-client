import { Metadata } from './../model/metadata.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DocumentItem } from '../model/documentItem.model';
import { Router } from '@angular/router';
import { forkJoin, Subject, Observable } from 'rxjs';
import { Ocr } from '../model/ocr.model';
import { LocalStorageService } from './local-storage.service';
import { Mods } from '../model/mods.model';
import { Note } from '../model/note.model';
import { Atm } from '../model/atm.model';
import { Page } from '../model/page.model';
import { PageUpdateHolder } from '../components/editor/editor-pages/editor-pages.component';
import { NewObjectData, NewObjectDialogComponent } from '../dialogs/new-object-dialog/new-object-dialog.component';
import { MatDialog } from '@angular/material';
import { UIService } from './ui.service';
import { ParentDialogComponent } from '../dialogs/parent-dialog/parent-dialog.component';
import { Batch } from '../model/batch.model';
import { IngestDialogComponent } from '../dialogs/ingest-dialog/ingest-dialog.component';
import { ModelTemplate } from '../templates/modelTemplate';
import { ChildrenValidationDialogComponent } from '../dialogs/children-validation-dialog/children-validation-dialog.component';

@Injectable()
export class EditorService {

    public preparation = false;

    public state = 'none';
    public ready = false;
    // public document: DocumentWrapper;

    public thirdEditorType = 'none'; // 'image' | 'mods'

    public rightEditorType = 'none'; // 'image' | 'comment' | 'ocr' | 'mods' | 'atm' | 'metadata'

    public leftEditorType = 'none'; // 'children' | 'image' | 'comment' | 'ocr' | 'mods' | 'atm' | 'metadata'

    public mode = 'chldren'; // 'detail' | 'children'

    public doubleRight = false;

    public left: DocumentItem;
    public right: DocumentItem;
    public children: DocumentItem[];

    public metadata: Metadata;

    private multipleChildrenMode: boolean;
    public relocationMode: boolean;

    private rightDocumentsubject = new Subject<DocumentItem>();

    private toParentFrom: string;

    parent: DocumentItem;
    previousItem: DocumentItem;
    nextItem: DocumentItem;
    path: { pid: string, label: string, model: string }[] = [];

    // template: any;
    allowedChildrenModels: string[];


    public selectedColumns = [
        { field: 'label', selected: true },
        { field: 'model', selected: true },
        { field: 'pid', selected: false },
        { field: 'owner', selected: false },
        { field: 'created', selected: false },
        { field: 'modified', selected: true },
        { field: 'status', selected: false }
    ]

    constructor(
        private router: Router,
        private api: ApiService,
        private ui: UIService,
        private dialog: MatDialog,
        private properties: LocalStorageService) {
    }

    watchRightDocument(): Observable<DocumentItem> {
        return this.rightDocumentsubject.asObservable();
    }

    init(params: EditorParams) {
        this.previousItem = null;
        this.nextItem = null;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.selectRight(null);
        this.ready = false;
        this.metadata = null;
        this.multipleChildrenMode = false;
        this.relocationMode = false;
        this.state = 'loading';
        this.preparation = params.preparation;
        if (params.preparation) {
            this.initBatchEditor(params.pid);
        } else {
            this.initDocumentEditor(params.pid);
        }
        this.initSelectedColumns();
    }

    initSelectedColumns() {
        if (this.properties.getStringProperty('selectedColumns')) {
            this.selectedColumns = JSON.parse(this.properties.getStringProperty('selectedColumns'));
        }
    }

    setSelectedColumns() {
        this.properties.setStringProperty('selectedColumns', JSON.stringify(this.selectedColumns));
    }

    initBatchEditor(id: string) {
        const obj = new DocumentItem();
        obj.pid = id;
        this.api.getImportBatch(parseInt(id)).subscribe((batch: Batch) => {
            obj.parent = batch.parentPid;
            this.api.getBatchPages(id).subscribe((pages: DocumentItem[]) => {
                this.left = obj;
                this.children = pages;
                this.mode = 'children'
                this.rightEditorType = 'mods';
                if (this.children.length > 0) {
                    this.selectRight(this.children[0]);
                }
                this.state = 'success';
                this.ready = true;
            });
        });
    }

    reloadBatch(callback: () => void, moveToNext = false) {
        this.api.getBatchPages(this.left.pid).subscribe((pages: DocumentItem[]) => {
            if (this.isMultipleChildrenMode()) {
                for (const oldChild of this.children) {
                    if (oldChild.selected) {
                        for (const newChild of pages) {
                            if (oldChild.pid === newChild.pid) {
                                newChild.selected = true;
                            }
                        }
                    }
                }
                this.children = pages;
            } else {
                this.children = pages;
                if (this.children.length > 0) {
                    let index = 0;
                    if (this.right) {
                        for (let i = 0; i < this.children.length; i++) {
                            if (this.right.pid == this.children[i].pid) {
                                index = i;
                                break;
                            }
                        }
                    }
                    if (moveToNext && this.children.length > index + 1) {
                        index += 1;
                    }
                    this.selectRight(this.children[index]);
                }
            }
            if (callback) {
                callback();
            }
        });
    }



    moveToNext() {
        let index = -1;
        for (let i = 0; i < this.children.length; i++) {
            if (this.right == this.children[i]) {
                index = i;
                break;
            }
        }
        index += 1;
        if (index < this.children.length) {
            this.selectRight(this.children[index]);
            const item = this.children[index];
            if (this.isMultipleChildrenMode()) {
                this.setSingleChildMode(item);
            }
            item.selected = true;
        }

    }

    initDocumentEditor(pid: string) {
        const rDoc = this.api.getDocument(pid);
        const rChildren = this.api.getRelations(pid);
        forkJoin(rDoc, rChildren).subscribe(([item, children]: [DocumentItem, DocumentItem[]]) => {
            this.left = item;
            const model = this.left.model;
            this.allowedChildrenModels = ModelTemplate.allowedChildrenForModel(model);
            this.children = children;
            if (item.isPage() || item.isSong()) {
                this.switchMode('detail');
            } else {
                const mode = this.properties.getStringProperty('editor.mode', 'detail');
                this.switchMode(mode);
            }
            const pid = item.pid;
            //this.path = [{pid: item.pid, label: item.label}];
            this.path = [];
            this.api.getParent(pid).subscribe((item: DocumentItem) => {
                if (this.left && this.left.pid == pid) {
                    this.parent = item;
                    if (item) {
                        this.path.unshift({ pid: item.pid, label: item.label, model: item.model });
                        this.setPath(item.pid);
                    }
                    this.setupNavigation();
                }
            });
            this.state = 'success';
            this.ready = true;
        }, error => {
            // TODO
        });
    }

    setPath(pid: string) {
        this.api.getParent(pid).subscribe((item: DocumentItem) => {
            if (item) {
                this.path.unshift({ pid: item.pid, label: item.label, model: item.model });
                this.setPath(item.pid);
            }
        });

    }


    public getBatchId(): string {
        if (this.preparation && this.left) {
            return this.left.pid;
        }
    }

    public getBatchParent(): string {
        if (this.preparation && this.left) {
            return this.left.parent;
        }
    }

    public onlyPageChildren(): boolean {
        for (const child of this.children) {
            if (!child.isPage()) {
                return false;
            }
        }
        return true;
    }

    public anyPageChildren(): boolean {
        if (this.children.length == 0) {
            return true;
        }
        for (const child of this.children) {
            if (child.isPage()) {
                return true;
            }
        }
        return false;
    }


    public enterDoubleRight() {
        if (this.rightEditorType === 'image' || this.rightEditorType == 'mods') {
            this.switchRightEditor('metadata')
        }
        setTimeout(() => {
            this.doubleRight = true;
            this.properties.setBoolProperty('editor.double_right_' + this.right.model, true);
        }, 100);
    }


    public isDoubleRight(): boolean {
        return this.doubleRight && this.right && this.right.isPage() && !this.showRelocationEditor();
    }

    public leaveDoubleRight() {
        this.doubleRight = false;
        this.properties.setBoolProperty('editor.double_right_' + this.right.model, false);
    }


    public showRightObjectEditor(): boolean {
        return this.right && !this.relocationMode && (this.numberOfSelectedChildren() < 2);
    }

    public showRelocationEditor(): boolean {
        if (this.mode !== 'children') {
            return false;
        }
        return this.relocationMode;
    }

    public showPagesEditor(): boolean {
        if (this.mode !== 'children') {
            return false;
        }
        if (this.relocationMode) {
            return false;
        }
        if (this.numberOfSelectedChildren() < 2) {
            return false;
        }
        let count = 0;
        for (const child of this.children) {
            if (child.selected) {
                count += 1;
                if (!child.isPage()) {
                    return false;
                }
            }
        }
        return count > 0;
    }

    public switchLeftEditor(type: string) {
        this.leftEditorType = type;
        if (this.left.isPage()) {
            this.properties.setStringProperty('editor.page_left_editor_type', this.leftEditorType);
        } else {
            this.properties.setStringProperty('editor.left_editor_type', this.leftEditorType);
        }
    }

    public switchRightEditor(type: string) {
        this.rightEditorType = type;
        this.properties.setStringProperty('editor.right_editor_' + this.right.model, type);
    }

    public switchThirdEditor(type: string) {
        this.thirdEditorType = type;
        this.properties.setStringProperty('editor.third_editor_' + this.right.model, type);
    }

    public switchMode(mode: string) {
        this.multipleChildrenMode = false;
        this.relocationMode = false;
        this.mode = mode;
        if (!this.left.isPage()) {
            this.properties.setStringProperty('editor.mode', this.mode);
        }
        if (this.mode === 'children') {
            // const index = this.findChildIndex();
            // if (index >= 0) {
            //     this.selectRight(this.children[index]);
            // }
            this.selectRight(this.left);
            this.toParentFrom = null;
        } else {
            this.selectRight(this.left);
            if (this.left.isPage()) {
                this.leftEditorType = this.properties.getStringProperty('editor.page_left_editor_type', 'metadata');
            } else {
                this.leftEditorType = this.properties.getStringProperty('editor.left_editor_type', 'metadata');
            }
        }
    }



    private findChildIndex() {
        if (this.children.length == 0) {
            return -1;
        }
        if (!this.toParentFrom) {
            return 0;
        }
        let idx = 0;
        for (const item of this.children) {
            if (item.pid == this.toParentFrom) {
                return idx;
            }
            idx += 1;
        }
        return 0;
    }



    public goToParentObject() {
        if (this.parent) {
            this.toParentFrom = this.left.pid;
            this.goToObject(this.parent);
        } else {
            this.state = 'success';
        }
    }

    public goToObject(item: DocumentItem) {
        if (item) {
            this.router.navigate(['/document', item.pid]);
        }
    }

    public goToObjectByPid(pid: string) {
        if (pid) {
            this.router.navigate(['/document', pid]);
        }
    }

    public selectRight(item: DocumentItem) {
        if (item) {
            // if (item.isPage()) {
            //     this.rightEditorType = this.properties.getStringProperty('editor.page_right_editor_type', 'image');
            // } else if (item.isSong()) {
            //     this.rightEditorType = this.properties.getStringProperty('editor.song_right_editor_type', 'image');
            // // } else if(item.isTopLevel()) {
            // //     this.rightEditorType = this.properties.getStringProperty('editor.top_right_editor_type', 'mods');
            // } else {
            //     this.rightEditorType = this.properties.getStringProperty('editor.right_editor_type', 'mods');
            // }
            this.rightEditorType = this.properties.getStringProperty('editor.right_editor_' + item.model, '');
            if (!this.rightEditorType) {
                if (item.isPage()) {
                    this.rightEditorType = 'image';
                } else if (item.isSong()) {
                    this.rightEditorType = 'song';
                } else if (item.canContainPdf()) {
                    this.rightEditorType = 'pdf';
                } else {
                    this.rightEditorType = 'mods';
                }
            }
            if (this.mode == 'children') {
                this.doubleRight = this.properties.getBoolProperty('editor.double_right_' + item.model, false);
                this.thirdEditorType = this.properties.getStringProperty('editor.third_editor_' + item.model, '');
                if (!this.thirdEditorType) {
                    if (item.isPage()) {
                        this.thirdEditorType = 'image';
                    } else if (item.isSong()) {
                        this.thirdEditorType = 'song';
                    } else if (item.canContainPdf()) {
                        this.thirdEditorType = 'pdf';
                    } else {
                        this.thirdEditorType = 'mods';
                    }
                }
            } else {
                this.doubleRight = false;
            }
        }
        this.right = item;
        this.rightDocumentsubject.next(item);
    }




    public goToPreviousObject() {
        if (this.previousItem) {
            this.goToObject(this.previousItem);
        }
    }

    public goToNextObject() {
        if (this.nextItem) {
            this.goToObject(this.nextItem);
        }
    }

    private setupNavigation() {
        this.previousItem = null;
        this.nextItem = null;
        if (!this.parent) {
            return;
        }
        const parentId = this.parent.pid;
        this.api.getRelations(this.parent.pid).subscribe((siblings: DocumentItem[]) => {
            let index = -1;
            let i = -1;
            for (const sibling of siblings) {
                i += 1;
                if (sibling.pid === this.left.pid) {
                    index = i;
                    break;
                }
            }
            if (index >= 1 && this.parent.pid == parentId) {
                this.previousItem = siblings[index - 1];
            }
            if (index >= 0 && index < siblings.length - 1) {
                this.nextItem = siblings[index + 1];
            }
        });
    }

    canAddChildren(): boolean {
        return this.mode == 'children' && this.allowedChildrenModels && this.allowedChildrenModels.length > 0;
    }

    onCreateNewObject() {
        if (!this.canAddChildren()) {
            return;
        }
        const data: NewObjectData = {
            models: this.allowedChildrenModels,
            model: this.allowedChildrenModels[0],
            customPid: false,
            parentPid: this.left.pid
        }
        const dialogRef = this.dialog.open(NewObjectDialogComponent, { data: data });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result['pid']) {
                this.state = 'saving';
                const pid = result['pid'];
                this.reloadChildren(() => {
                    for (const item of this.children) {
                        if (item.pid == pid) {
                            this.selectRight(item);
                            break;
                        }
                    }
                    this.state = 'success';
                });
            }
        });

    }

    saveChildren(callback: () => void) {
        this.state = 'saving';
        const pidArray = this.children.map(item => item.pid);
        const request = this.preparation ? this.api.editBatchRelations(this.left.pid, pidArray) : this.api.editRelations(this.left.pid, pidArray);
        request.subscribe((response: any) => {
            
            if (response['response'].errors) {
                this.ui.showErrorSnackBarFromObject(response['response'].errors);
                this.state = 'error';
                return;
            }
            if (callback) {
                callback();
            }
            this.state = 'success';
        });
    }

    saveOcr(ocr: Ocr, callback: (Ocr) => void) {
        this.state = 'saving';
        this.api.editOcr(ocr, this.getBatchId()).subscribe((newOcr: Ocr) => {
            if (callback) {
                callback(newOcr);
            }
            this.state = 'success';
        });
    }

    saveMods(mods: Mods, ignoreValidation: boolean, callback: (Mods) => void) {
        this.state = 'saving';
        this.api.editModsXml(mods.pid, mods.content, mods.timestamp, ignoreValidation, this.getBatchId()).subscribe((resp: any) => {
            if (resp.errors) {
                this.state = 'error';
                this.ui.showErrorSnackBar(resp.errors.mods[0].errorMessage)
            } else {
                this.api.getMods(mods.pid, this.getBatchId()).subscribe((response: any) => {

                    if (response.errors) {
                        this.state = 'error';
                        this.ui.showErrorSnackBar(response.errors.mods[0].errorMessage)
                    } else {
                        const newMods: Mods = Mods.fromJson(response['record']);
                        if (this.mode === 'detail') {
                            this.metadata = Metadata.fromMods(newMods, this.metadata.model);
                        }
                        if (callback) {
                            callback(newMods);
                        }
                        this.state = 'success';
                    }
                });
            }

        });
    }

    updateModsFromCatalog(xml: string, callback: () => void) {
        this.state = 'saving';
        this.api.editModsXml(this.metadata.pid, xml, this.metadata.timestamp, false).subscribe(() => {
            this.api.getMods(this.metadata.pid).subscribe((response: any) => {
                const mods: Mods = Mods.fromJson(response['record']);
                this.metadata = Metadata.fromMods(mods, this.metadata.model);
                if (this.mode === 'children') {
                    this.reloadChildren(() => {
                        if (callback) {
                            callback();
                        }
                    });
                } else if (this.mode === 'detail') {
                    this.selectRight(this.right);
                }
                this.state = 'success';
            });
        });
    }

    saveNote(note: Note, callback: (Note) => void) {
        this.state = 'saving';
        this.api.editNote(note, this.getBatchId()).subscribe((newNote: Note) => {
            if (callback) {
                callback(newNote);
            }
            this.state = 'success';
        });
    }

    saveAtm(atm: Atm, callback: (Atm) => void) {
        this.state = 'saving';
        this.api.editAtm(atm, this.getBatchId()).subscribe((response: any) => {
            if (response.response.errors) {
                this.ui.showErrorSnackBarFromObject(response.response.errors);
                this.state = 'error';
                return;
            }
            const newAtm: Atm = Atm.fromJson(response['response']['data'][0]);
            if (callback) {
                callback(newAtm);
            }
            this.state = 'success';
        });
    }

    savePage(page: Page, callback: (Page) => void, moveToNext = false) {
        this.state = 'saving';
        this.api.editPage(page, this.getBatchId()).subscribe((resp: any) => {
            if (resp.response.errors) {
                this.ui.showErrorSnackBarFromObject(resp.response.errors);
                this.state = 'error';
                return;
            }
            const newPage: Page = Page.fromJson(resp['response']['data'][0], page.model);
            if (this.preparation) {
                this.reloadBatch(() => {
                    this.state = 'success';
                    if (callback && newPage.pid == this.right.pid) {
                        callback(newPage);
                    }
                }, moveToNext);
            } else {
                this.api.getDocument(page.pid).subscribe((doc: DocumentItem) => {
                    if (this.mode === 'children') {
                        this.reloadChildren(() => {
                            this.state = 'success';
                            if (callback && newPage.pid == this.right.pid) {
                                callback(newPage);
                            }
                        }, moveToNext);
                    } else {
                        this.selectRight(doc);
                        this.left = doc;
                        this.state = 'success';
                        if (callback) {
                            callback(newPage);
                        }
                    }
                });
            }
        });
    }

    saveMetadata(ignoreValidation: boolean, callback: (r: any) => void) {
        this.state = 'saving';
        this.api.editMetadata(this.metadata, ignoreValidation).subscribe((response: any) => {
            console.log(response)
            if (response.errors) {
                if (response.status === -4) {
                    // Ukazeme dialog a posleme s ignoreValidation=true
                    this.state = 'error';
                    if (callback) {
                        callback(response);
                    }
                    return;
                } else {
                    this.ui.showErrorSnackBarFromObject(response.errors);
                    this.state = 'error';
                    return;
                }
            }

            // .pipe(map(response => Mods.fromJson(response['data'][0])));


            const rDoc = this.api.getDocument(this.metadata.pid);
            const rMods = this.api.getMods(this.metadata.pid);
            forkJoin(rDoc, rMods).subscribe(([doc, responseMods]: [DocumentItem, any]) => {

                const mods: Mods = Mods.fromJson(responseMods['record']);

                this.metadata = Metadata.fromMods(mods, this.metadata.model);
                this.selectRight(doc);
                if (this.mode === 'children') {
                    this.reloadChildren(() => {
                        this.state = 'success';
                        if (callback) {
                            callback(null);
                        }
                    });
                } else if (this.mode === 'detail') {
                    this.left = doc;
                    this.state = 'success';
                    if (callback) {
                        callback(null);
                    }
                }
            });
        });
    }

    loadMetadata(callback: () => void) {
        if (this.metadata && this.metadata.pid === this.right.pid) {
            callback();
            return;
        }
        this.api.getMetadata(this.right.pid, this.right.model).subscribe((metadata: Metadata) => {
            this.metadata = metadata;
            if (callback) {
                callback();
            }
        });
    }

    deleteSelectedChildren(pernamently: boolean, callback: (boolean) => void) {
        this.state = 'saving';
        let pids: string[];
        if (this.isMultipleChildrenMode()) {
            pids = this.children.filter(c => c.selected).map(c => c.pid);
        } else {
            pids = [this.right.pid];
        }
        this.api.deleteObjects(pids, pernamently, this.getBatchId()).subscribe((response: any) => {

            if (response['response'].errors) {
                this.ui.showErrorSnackBarFromObject(response['response'].errors);
                this.state = 'error';
                return;
            } else {
                const removedPid: string[] = response['response']['data'].map(x => x.pid);
                let nextSelection = 0;
                for (let i = this.children.length - 1; i >= 0; i--) {
                    if (removedPid.indexOf(this.children[i].pid) > -1) {
                        this.children.splice(i, 1);
                        nextSelection = i - 1;
                    }
                }
                if (nextSelection < 0) {
                    nextSelection = 0;
                }
                if (this.children.length > 0 && !this.isMultipleChildrenMode()) {
                    this.selectRight(this.children[nextSelection]);
                }
                if (callback) {
                    callback(true);
                }
                this.state = 'success';
            }



        });
    }

    deleteParent(parent: string) {
        this.state = 'saving';
        this.api.deleteParent(this.left.pid, parent).subscribe((response: any) => {
            if (response['response'].errors) {
                this.ui.showErrorSnackBarFromObject(response['response'].errors);
                this.state = 'error';
                return;
            } else {
                this.state = 'success';
                this.init(
                    {
                        pid: this.left.pid,
                        preparation: false
                    });

            }
        });
    }

    setParent(destinationPid: string, openDestination: boolean) {
        this.state = 'saving';
        let pids: string[];
        if (this.isMultipleChildrenMode()) {
            pids = this.children.filter(c => c.selected).map(c => c.pid);
        } else {
            pids = [this.right.pid];
        }
        this.api.setParent(this.left.pid, destinationPid).subscribe((response: any) => {
            if (response['response'].errors) {
                this.ui.showErrorSnackBarFromObject(response['response'].errors);
                this.state = 'error';
                return;
            } else {
                this.state = 'success';
                this.init(
                    {
                        pid: this.left.pid,
                        preparation: false
                    });
            }
        });
    }

    relocateObjects(parentPid: string, destinationPid: string, openDestination: boolean) {
        this.state = 'saving';
        let pids: string[];
        if (this.isMultipleChildrenMode()) {
            pids = this.children.filter(c => c.selected).map(c => c.pid);
        } else {
            pids = [this.right.pid];
        }
        this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
            if (response['response'].errors) {
                this.ui.showErrorSnackBarFromObject(response['response'].errors);
                this.state = 'error';
                return;
            }
            if (!openDestination) {
                this.setRelocationMode(false);
                let nextSelection = 0;
                for (let i = this.children.length - 1; i >= 0; i--) {
                    if (pids.indexOf(this.children[i].pid) > -1) {
                        this.children.splice(i, 1);
                        nextSelection = i - 1;
                    }
                }
                if (nextSelection < 0) {
                    nextSelection = 0;
                }
                if (this.children.length > 0 && !this.isMultipleChildrenMode()) {
                    this.selectRight(this.children[nextSelection]);
                }
                this.state = 'success';
                // this.goToObjectByPid(destinationPid);
            } else {
                this.goToObjectByPid(destinationPid);
            }
        });
    }

    setRelocationMode(enabled: boolean) {
        this.relocationMode = enabled;
    }

    switchRelocationMode() {
        this.setRelocationMode(!this.relocationMode);
    }

    switchMultipleSelectionMode() {
        this.setMultipleChildrenMode(!this.multipleChildrenMode);
    }

    setMultipleChildrenMode(enabled: boolean) {
        if (enabled) {
            this.multipleChildrenMode = true;
            this.right.selected = true;
            // this.doubleRight = false;
            // this.selectRight(null);
        } else {
            const firtsSelectionIndex = this.firstSelectedIndex();
            this.deselectChildren();
            this.multipleChildrenMode = false;
            if (this.children.length > firtsSelectionIndex) {
                this.selectRight(this.children[firtsSelectionIndex]);
            }
        }
    }

    setSingleChildMode(item: DocumentItem) {
        this.deselectChildren();
        this.multipleChildrenMode = false;
    }

    // Returns the first selected index
    private firstSelectedIndex(): number {
        let index = -1;
        for (const child of this.children) {
            index += 1;
            if (this.right == child) {
                // if (child.selected) {
                return index;;
            }
        }
        return 0;
    }


    validateChildren() {
        const dialogRef = this.dialog.open(ChildrenValidationDialogComponent, { data: { children: this.children, batchId: this.getBatchId() } });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    selectChildren() {
        if (!this.multipleChildrenMode) {
            this.setMultipleChildrenMode(true);
        }
        for (const child of this.children) {
            child.selected = true;
        }
    }

    deselectChildren() {
        if (!this.multipleChildrenMode) {
            this.setMultipleChildrenMode(true);
        }
        for (const child of this.children) {
            child.selected = false;
        }
    }

    isMultipleChildrenMode(): boolean {
        return this.multipleChildrenMode || this.children.filter(ch => ch.selected).length > 0;
    }

    numberOfSelectedChildren(): number {
        let count = 0;
        for (const item of this.children) {
            if (item.selected) {
                count++;
            }
        }
        return count;
    }

    getSelectedChildren() {
        return this.children.filter(ch => ch.selected);
    }

    editSelectedBatchPages(holder: PageUpdateHolder, callback: () => void) {
        this.state = 'saving';
        const pages = [];
        let index = -1;
        let all = 0;
        if (holder.applyToFirst) {
            all = -1;
        }
        for (const item of this.children) {
            if (item.selected) {
                all += 1;
                if (all % holder.applyTo > 0) {
                    continue;
                }
                index += 1;
                const page = new Page();
                page.model = item.model;
                page.pid = item.pid;
                if (holder.editType) {
                    page.type = holder.pageType;
                }
                if (holder.editIndex) {
                    page.index = String(holder.pageIndex + index);
                }
                if (holder.editNumber) {
                    console.log(holder)
                    page.number = String(holder.getNumberForIndex(index));
                }
                pages.push(page);
            }
        }
        this.updateBatchPages(pages, callback);
    }

    private updateBatchPages(pages: Page[], callback: () => void) {
        if (pages.length === 0) {
            this.reloadBatch(() => {
                this.state = 'success';
                if (callback) {
                    callback();
                }
            });
            return;
        }
        const pageDef = pages.pop();
        this.api.getPage(pageDef.pid, pageDef.model, this.getBatchId()).subscribe((page: Page) => {
            if (pageDef.type) {
                page.type = pageDef.type;
            }
            if (pageDef.index) {
                page.index = pageDef.index;
            }
            if (pageDef.number) {
                page.number = pageDef.number;
            }
            this.api.editPage(page, this.getBatchId()).subscribe((resp: any) => {

                if (resp.response.errors) {
                    this.ui.showErrorSnackBarFromObject(resp.response.errors);
                    this.state = 'error';
                    return;
                }
                const newPage: Page = Page.fromJson(resp['response']['data'][0], page.model);
                this.updateBatchPages(pages, callback);
            });
        });
    }


    updateSelectedPages(holder: PageUpdateHolder, callback: () => void) {
        if (this.preparation) {
            this.editSelectedBatchPages(holder, callback);
            return;
        }
        this.state = 'saving';
        const pages = [];
        for (const item of this.children) {
            if (item.isPage() && item.selected) {
                pages.push(item.pid);
            }
        }
        this.api.editPages(pages, holder, this.getBatchId()).subscribe((result: any) => {
            if (result.response.errors) {
                this.ui.showErrorSnackBarFromObject(result.response.errors);
                this.state = 'error';
            } else {
                this.reloadChildren(() => {
                    this.state = 'success';
                });
            }
        })
    }

    changeBrackets(holder: PageUpdateHolder, useBrackets: boolean, callback: () => void) {
        if (this.preparation) {
            this.editSelectedBatchPages(holder, callback);
            return;
        }
        this.state = 'saving';
        const pages = [];
        for (const item of this.children) {
            if (item.isPage() && item.selected) {
                pages.push(item.pid);
            }
        }
        this.api.editBrackets(pages, holder, useBrackets, this.getBatchId()).subscribe(result => {
            this.reloadChildren(() => {
                this.state = 'success';
            });
        })
    }


    reindexChildren() {
        let pagePid = null;
        let model = null;
        for (const page of this.children) {
            if (page.isPage()) {
                pagePid = page.pid;
                model = page.model;
                break;
            }
        }
        if (!pagePid) {
            return;
        }
        this.state = 'saving';
        this.api.reindexPages(this.left.pid, pagePid, this.getBatchId(), model).subscribe(result => {

            if (result.response.errors) {
                this.ui.showErrorSnackBarFromObject(result.response.errors);
                this.state = 'error';
            } else if (result.response.data) {
                this.ui.showErrorSnackBarFromObject(result.response.data.map(d => d.errorMessage = d.validation));
                this.state = 'error';
            } else {
                this.state = 'success';
                this.ui.showInfoSnackBar("Objekty byly reindexovány");
            }
        });
    }

    reloadChildren(callback: () => void, moveToNext = false) {
        this.api.getRelations(this.left.pid).subscribe((children: DocumentItem[]) => {
            if (this.isMultipleChildrenMode()) {
                for (const oldChild of this.children) {
                    if (oldChild.selected) {
                        for (const newChild of children) {
                            if (oldChild.pid === newChild.pid) {
                                newChild.selected = true;
                            }
                        }
                    }
                }
            } else {
                if (this.right) {
                    let index = 0;
                    for (let i = 0; i < children.length; i++) {
                        if (this.right.pid == children[i].pid) {
                            index = i;
                            break;
                        }
                    }
                    if (moveToNext && children.length > index + 1) {
                        index += 1;
                    }
                    this.selectRight(children[index]);
                }
            }
            this.children = children;
            if (callback) {
                callback();
            }
        });
    }

    ingest() {
        const batchParent = this.getBatchParent();
        if (batchParent) {
            this.ingestBatch(batchParent);
        } else {
            const dialogRef = this.dialog.open(ParentDialogComponent, { data: { btnLabel: 'import.save' } });
            dialogRef.afterClosed().subscribe(result => {
                if (result && result.pid) {
                    this.ingestBatch(result.pid);
                }
            });
        }
    }

    private ingestBatch(parentPid: string) {
        this.state = 'loading';
        const bathId = parseInt(this.getBatchId());
        const dialogRef = this.dialog.open(IngestDialogComponent, { data: { batch: bathId, parent: parentPid } });
        dialogRef.afterClosed().subscribe(result => {
            this.state = 'success';
            if (result == 'open') {
                this.router.navigate(['/document', parentPid]);
            } else {
                this.router.navigate(['/']);
            }
        });

        // this.api.setParentForBatch(bathId, parentPid).subscribe((batch: Batch) => {
        //   this.api.ingestBatch(bathId, parentPid).subscribe((batch: Batch) => {
        //     this.ui.showInfoSnackBar("Uloženo do úložiště");
        //     this.state = 'success';
        //     this.router.navigate(['/document', parentPid]);
        //   },
        //   (error) => {
        //     console.log('ingest batch error', error);
        //     this.state = 'success';
        //     this.ui.showErrorSnackBar("Uložení do úložiště se nezdařilo");
        //   });
        // },
        // (error) => {
        //   console.log('sitting parent error', error);
        //   this.state = 'success';
        //   this.ui.showErrorSnackBar("Uložení do úložiště se nezdařilo");
        // });
    }











    getEditorDate() {

    }


    formatPagesCount(): string {
        if (!this.children) {
            return "";
        }
        const c = this.children.length;
        if (c == 0) {
            return 'žádná strana';
        }
        if (c == 1) {
            return '1 strana';
        }
        if (c < 5) {
            return `${c} strany`;
        }
        return `${c} stran`;
    }







}

export interface EditorParams {
    pid: string;
    preparation: boolean;
}
