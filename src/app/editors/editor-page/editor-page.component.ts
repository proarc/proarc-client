import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChange, Output, EventEmitter, input, output, effect } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { Page } from '../../model/page.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';
import { Configuration } from '../../shared/configuration';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    EditorSwitcherComponent],
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements OnInit {

  pid = input<string>();
  model = input<string>();
  panel = input<ILayoutPanel>();
  panelType = input<string>();
  notSaved = input<boolean>();
  onChangePanelType = output<string>();
  onIngest = output<boolean>();

  switchableTypes = ['mods', 'metadata', 'atm', 'ocr']
  switchable: boolean = true;

  countPlurals(): string {
    let count = this.layout.getNumOfSelected();
    if (count > 4) {
      return '5'
    } else if (count > 1) {
      return '4'
    } else {
      return count + '';
    }
  }

  state = 'none';


  positions = ['left', 'right', 'singlePage'];
  genres = ['page', 'reprePage'];

  @ViewChild("pageNumber") pageNumberField: ElementRef;
  @ViewChild("pageIndex") pageIndexField: ElementRef;
  @ViewChild("typeSelect") typeSelect: MatSelect;
  @ViewChild("posSelect") posSelect: MatSelect;
  @ViewChild("genreSelect") genreSelect: MatSelect;

  pageTypeControl: FormControl<{ code: string, name: string } | null> = new FormControl<{ code: string, name: string } | null>(null);
  pageNumberControl = new FormControl();
  pageIndexControl = new FormControl();
  posControl = new FormControl();
  genreControl = new FormControl();
  noteControl = new FormControl();
  controls: FormGroup = new FormGroup({
    type: this.pageTypeControl,
    number: this.pageNumberControl,
    index: this.pageIndexControl,
    position: this.posControl,
    genre: this.genreControl,
    note: this.noteControl
  });

  public page: Page;
  lastFocus = 'pageIndex';

  constructor(
    public layout: LayoutService,
    //public editor: EditorService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public config: Configuration,
    public translator: TranslateService) {
    effect(() => {
      const pid = this.pid();
      if (!pid) {
        return;
      }
      this.onPidChanged(pid);

    });
  }

  ngOnInit() {

  }

  removeFocus() {
    this.layout.movedToNextFrom = null;
  }

  setFocus(f: string) {
    this.lastFocus = f;
  }

  private setPage(page: Page) {
    this.page = page;
    this.controls.get('type').setValue(page.type);
    this.controls.patchValue({
      type: this.page.type,
      number: this.page.number,
      index: this.page.index,
      position: this.page.position,
      genre: this.page.genre,
      note: this.page.note
    });
    this.controls.markAsPristine();
    this.layout.clearPanelEditing();
    this.state = 'success';
    if (this.layout.movedToNextFrom == 'pageNumber') {
      setTimeout(() => {
        this.pageNumberField.nativeElement.focus();
      }, 10);
    } else if (this.layout.movedToNextFrom == 'pageIndex') {
      setTimeout(() => {
        this.pageIndexField.nativeElement.focus();
      }, 10);
    } else if (this.layout.movedToNextFrom == 'type') {
      setTimeout(() => {
        this.typeSelect.focus();
      }, 10);
    } else if (this.layout.movedToNextFrom == 'position') {
      setTimeout(() => {
        this.posSelect.focus();
      }, 10);
    } else if (this.layout.movedToNextFrom == 'genre') {
      setTimeout(() => {
        this.genreSelect.focus();
      }, 10);
    }
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.page = null;
    if (this.layout.type === 'kramerius') {
      this.setPage(this.layout.krameriusPage);
      this.state = 'success';
      return;
    } else if (this.layout.lastSelectedItem().notSaved) {
      const page = new Page();
      page.pid = pid;
      page.type = 'normalPage';
      page.model = this.layout.lastSelectedItem().model;
      page.number = this.layout.lastSelectedItem().label;
      page.timestamp = new Date().getTime();
      this.setPage(page);
      this.controls.markAsDirty();
      this.layout.setPanelEditing(this.panel());
      this.state = 'success';
      return;
    }
    this.api.getPage(pid, this.model(), this.layout.batchId).subscribe((page: Page) => {
      this.setPage(page);
      this.state = 'success';
    });
  }

  onRevert() {
    this.page.restore();
  }

  onSaveFrom(from: string) {
    if (this.layout.type === 'repo') {
      this.onSave(null);
    } else {
      this.onSave(from);
    }

  }

  isInBrackets(): boolean {
    if (!this.page.number) {
      return false;
    }
    return this.page.number.startsWith('[') && this.page.number.endsWith(']');
  }

  addBrackets() {
    if (!this.page.number) {
      return
    }
    if (!this.isInBrackets()) {
      let number = this.page.number;
      if (!number.startsWith('[')) {
        number = '[' + number;
      }
      if (!number.endsWith(']')) {
        number = number + ']';
      }
      this.page.number = number;
      this.onSave(null);
    }

  }

  removeBrackets() {
    if (!this.page.number) {
      return
    }
    if (this.isInBrackets()) {
      this.page.number = this.page.number.substring(1, this.page.number.length - 1);
      this.onSave(null);
    }
  }

  switchBrackets() {
    if (!this.page.number) {
      return
    }
    if (this.isInBrackets()) {
      this.page.number = this.page.number.substring(1, this.page.number.length - 1);
    } else {
      let number = this.page.number;
      if (!number.startsWith('[')) {
        number = '[' + number;
      }
      if (!number.endsWith(']')) {
        number = number + ']';
      }
      this.page.number = number;
    }
  }

  private validate(): boolean {
    if (!this.page.number) {
      return false;
    }
    if (this.config.showPageIndex && !this.page.index) {
      return false;
    }
    if (!this.page.type) {
      return false;
    }
    if ((this.page.isNdkPage() || this.page.isSttPage()) && !this.page.genre) {
      return false;
    }
    return true;
  }

  saveIcon() {
    // this.setPage(this.controls.value);
    Object.keys(this.controls.controls).forEach((key: string) => {
      this.page[key as keyof (Page)] = this.controls.get(key).value;
    });
    if (this.layout.type === 'repo') {
      this.onSave(null);
    } else {
      this.onSave(this.lastFocus)
    }
  }

  onSave(from: string = null) {
    if (this.validate()) {
      this.save(from);
    } else {
      const data: SimpleDialogData = {
        title: "Nevalidní data",
        message: "Nevalidní data, přejete si dokument přesto uložit?",
        alertClass: 'app-message',
        btn1: {
          label: "Uložit nevalidní dokument",
          value: 'yes',
          color: 'warn'
        },
        btn2: {
          label: "Neukládat",
          value: 'no',
          color: 'default'
        },
      };
      const dialogRef = this.dialog.open(SimpleDialogComponent, { autoFocus: true, data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.save(from);
        }
      });
    }
  }

  private saveToKramerius() {
    this.api.saveKrameriusJSON(this.page.pid, this.layout.krameriusInstance, JSON.stringify(this.page.toJson()), this.page.timestamp).subscribe((response: any) => {
      this.layout.setShouldRefresh(false);
    });
  }

  private save(from: string) {
    this.layout.movedToNextFrom = from;
    this.controls.markAsPristine();
    this.layout.clearPanelEditing();
    if (!this.page.hasChanged()) {
      if (!!from) {
        this.layout.shouldMoveToNext(from);
      }
      return;
    }
    this.page.removeEmptyIdentifiers();
    if (this.layout.type === 'kramerius') {
      this.saveToKramerius();
      return;
    }
    if (this.layout.lastSelectedItem().notSaved) {
      let data = `model=${this.page.model}`;
      data = `${data}&pid=${this.page.pid}`;
      data = `${data}&xml=${this.page.toXml()}`;
      data = `${data}&parent=${this.layout.lastSelectedItem().parent}`;
      this.api.createObject(data).subscribe((response: any) => {
        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorDialogFromObject(response['response'].errors);
          this.state = 'error';
          return;
        }
        this.layout.lastSelectedItem().notSaved = false;
        const pid = response['response']['data'][0]['pid'];
        // this.layout.setShouldRefresh(true);
        this.layout.refreshSelectedItem(!!from, from);
        this.state = 'success';
      });
    } else {
      this.savePage(this.page, (page: Page) => {
        if (page) {
          this.page = page;
        }
      }, !!from, from);
    }
  }

  savePage(page: Page, callback: (page: Page) => void, moveToNext = false, from: string) {
    this.state = 'saving';
    this.api.editPage(page, this.layout.batchId).subscribe((resp: any) => {
      if (resp.response.errors) {
        this.ui.showErrorDialogFromObject(resp.response.errors);
        this.state = 'error';
        return;
      }
      if (this.layout.type !== 'repo') {
        // this.ui.showInfoDialog("Uloženo", 1000);
        this.ui.showInfoSnackBar(this.translator.instant('snackbar.changeSaved'), 4000);
      }
      const newPage: Page = Page.fromJson(resp['response']['data'][0], page.model);
      this.setPage(newPage);
      // this.layout.setShouldRefresh(true);
      this.layout.refreshSelectedItem(moveToNext, from);

      this.state = 'success';
    });
  }

  public hasChanged() {
    if (!this.page) {
      return false;
    }

    //const hasChanges = this.page.hasChanged();
    const hasChanges = this.controls.dirty;
    if (hasChanges) {
      this.layout.setPanelEditing(this.panel());
    } else {
      if (this.panel().canEdit) {
        this.layout.clearPanelEditing();
      }

    }
    return hasChanges;
  }


  enterSelect(s: MatSelect, from: string) {
    s.close();
    this.onSaveFrom(from);
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

}
