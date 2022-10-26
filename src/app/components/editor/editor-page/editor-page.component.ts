import { CodebookService } from './../../../services/codebook.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Page } from 'src/app/model/page.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { UIService } from 'src/app/services/ui.service';
import { LayoutService } from 'src/app/services/layout.service';
import { DocumentItem } from 'src/app/model/documentItem.model';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements OnInit {

  @Input() notSaved = false;
  state = 'none';
  // page: Page;

  positions = ['left', 'right', 'singlePage'];
  genres = ['page', 'reprePage'];

  // movedToNextFrom: string;

  @Input() model: string;


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
    pageTypeControl: this.pageTypeControl,
    pageNumberControl: this.pageNumberControl,
    pageIndexControl: this.pageIndexControl,
    posControl: this.posControl,
    genreControl: this.genreControl,
    noteControl: this.noteControl
  });

  public page: Page;

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(
    public layout: LayoutService,
    //public editor: EditorService,
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public config: ConfigService,
    public codebook: CodebookService,
    public translator: TranslateService) {
  }

  ngOnInit() {
    this.controls.valueChanges.subscribe((e: any) => {
      this.layout.isDirty = this.controls.dirty;
    })
  }

  removeFocus() {
    this.layout.movedToNextFrom = null;
  }

  private setPage(page: Page) {
    this.page = page;
    this.controls.get('pageTypeControl').setValue(page.type);
    this.controls.markAsPristine();
    this.layout.isDirty = false;
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
    if (this.layout.selectedItem.notSaved) {
      const page = new Page();
      page.pid = pid;
      page.type = 'normalPage';
      page.model = this.layout.selectedItem.model;
      page.number = this.layout.selectedItem.label;
      page.timestamp = new Date().getTime();
      this.setPage(page);
      this.controls.markAsDirty();
      this.layout.isDirty = true;
      this.state = 'success';
      return;
    }
    this.api.getPage(pid, this.model, this.layout.getBatchId()).subscribe((page: Page) => {
      this.setPage(page);
      this.state = 'success';
    });
  }

  onRevert() {
    this.page.restore();
  }

  onSaveFrom(from: string) {
    this.onSave(from);
  }

  isInBrackets(): boolean {
    if (!this.page.number) {
      return false;
    }
    return this.page.number.startsWith('[') && this.page.number.endsWith(']');
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
    if (this.page.isNdkPage() && !this.page.genre) {
      return false;
    }
    return true;
  }

  onSave(from: string = null) {
    if (this.validate()) {
      this.save(from);
    } else {
      const data: SimpleDialogData = {
        title: "Nevalidní data",
        message: "Nevalidní data, přejete si dokument přesto uložit?",
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
      const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.save(from);
        }
      });
    }
  }

  private save(from: string) {
    this.layout.movedToNextFrom = from;
    this.controls.markAsPristine();
    this.layout.isDirty = false;
    if (!this.page.hasChanged()) {
      if (!!from) {
        this.layout.shouldMoveToNext(from);
      }
      return;
    }
    this.page.removeEmptyIdentifiers();
    if (this.layout.selectedItem.notSaved) {
      let data = `model=${this.page.model}`;
      data = `${data}&pid=${this.page.pid}`;
      data = `${data}&xml=${this.page.toXml()}`;
      data = `${data}&parent=${this.layout.selectedItem.parent}`;
      this.api.createObject(data).subscribe((response: any) => {
        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorSnackBarFromObject(response['response'].errors);
          this.state = 'error';
          return;
        }
        this.layout.selectedItem.notSaved = false;
        const pid = response['response']['data'][0]['pid'];
        this.layout.setShouldRefresh(true);
        this.state = 'success';
      });
    } else {
      this.savePage(this.page, (page: Page) => {
        if (page) {
          this.page = page;
        }
      }, !!from);
    }
  }

  savePage(page: Page, callback: (page: Page) => void, moveToNext = false) {
    this.state = 'saving';
    this.api.editPage(page, this.layout.getBatchId()).subscribe((resp: any) => {
      if (resp.response.errors) {
        this.ui.showErrorSnackBarFromObject(resp.response.errors);
        this.state = 'error';
        return;
      }
      const newPage: Page = Page.fromJson(resp['response']['data'][0], page.model);
      this.layout.setShouldRefresh(true);
      if (this.layout.type === 'import') {
        // this.reloadBatch(() => {
        //   this.state = 'success';
        //   if (callback && newPage.pid == this.layout.selectedItem.pid) {
        //     callback(newPage);
        //   }
        // }, moveToNext);
      } else {
        // this.api.getDocument(page.pid).subscribe((doc: DocumentItem) => {
        //   if (this.mode === 'children') {
        //     this.reloadChildren(() => {
        //       this.state = 'success';
        //       if (callback && newPage.pid == this.selectedItem.pid) {
        //         callback(newPage);
        //       }
        //     }, moveToNext);
        //   } else {
        //     this.selectRight(doc);
        //     this.left = doc;
        //     this.state = 'success';
        //     if (callback) {
        //       callback(newPage);
        //     }
        //   }
        // });
      }
    });
  }

  public hasChanged() {
    return this.page.hasChanged();
  }


  enterSelect(s: MatSelect, from: string) {
    s.close();
    this.onSave(from);
  }

}
