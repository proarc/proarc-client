import { CodebookService } from './../../../services/codebook.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { Page } from 'src/app/model/page.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements OnInit {

  state = 'none';
  // page: Page;

  positions = ['left', 'right', 'singlePage'];
  genres = ['page', 'reprePage'];

  movedToNextFrom: string;

  @Input() model: string;

  @ViewChild("pageNumber") pageNumberField: ElementRef;
  @ViewChild("pageIndex") pageIndexField: ElementRef;
  @ViewChild("typeSelect") typeSelect: MatSelect;
  @ViewChild("posSelect") posSelect: MatSelect;
  @ViewChild("genreSelect") genreSelect: MatSelect;

  pageTypeControl: FormControl<{code: string, name: string} | null> = new FormControl<{code: string, name: string} | null>(null);
  pageNumberControl= new FormControl();
  pageIndexControl= new FormControl();
  posControl= new FormControl();
  genreControl= new FormControl();
  noteControl= new FormControl();
  controls: FormGroup = new FormGroup({
    pageTypeControl: this.pageTypeControl,
    pageNumberControl: this.pageNumberControl,
    pageIndexControl: this.pageIndexControl,
    posControl: this.posControl,
    genreControl: this.genreControl,
    noteControl: this.noteControl
  });

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(public editor: EditorService,
              private api: ApiService,
              private dialog: MatDialog,
              public config: ConfigService,
              public codebook: CodebookService,
              public translator: TranslateService) {
  }

  ngOnInit() {
    this.controls.valueChanges.subscribe((e: any) => {
      this.editor.isDirty = this.controls.dirty;
    })
  }

  removeFocus() {
    this.movedToNextFrom = '';
  }

  private setPage(page: Page) {
    this.editor.page = page;
    this.controls.get('pageTypeControl').setValue(page.type);
    this.controls.markAsPristine();
    this.editor.isDirty = false;
    this.state = 'success';
    if (this.movedToNextFrom == 'pageNumber') {
      setTimeout(() => { 
        this.pageNumberField.nativeElement.focus();
      },10);
    } else if (this.movedToNextFrom == 'pageIndex') {
      setTimeout(() => { 
        this.pageIndexField.nativeElement.focus();
      },10);
    } else if (this.movedToNextFrom == 'type') {
      setTimeout(() => { 
        this.typeSelect.focus();
      },10);
    } else if (this.movedToNextFrom == 'position') {
      setTimeout(() => { 
        this.posSelect.focus();
      },10);
    } else if (this.movedToNextFrom == 'genre') {
      setTimeout(() => { 
        this.genreSelect.focus();
      },10);
    }
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    if (this.editor.right.notSaved) {
      const page = Page.fromJson(this.editor.right.content, this.editor.right.model);
      this.setPage(page);
      this.state = 'success';
      return;
    }
    this.api.getPage(pid, this.model, this.editor.getBatchId()).subscribe((page: Page) => {
      this.setPage(page);

    }, () => {
      this.state = 'failure';
    });
  }

  onRevert() {
    this.editor.page.restore();
  }

  onSaveFrom(from: string) {
    this.onSave(from);
  }

  isInBrackets(): boolean {
    if (!this.editor.page.number) {
      return false;
    }
    return this.editor.page.number.startsWith('[') && this.editor.page.number.endsWith(']');
  }

  switchBrackets() {
    if (!this.editor.page.number) {
      return
    }
    if (this.isInBrackets()) {
      this.editor.page.number = this.editor.page.number.substring(1, this.editor.page.number.length - 1);
    } else {
      let number = this.editor.page.number;
      if (!number.startsWith('[')) {
        number = '[' + number;
      }
      if (!number.endsWith(']')) {
        number = number + ']';
      }
      this.editor.page.number = number;
    }
  }

  private validate(): boolean {
    if (!this.editor.page.number) {
      return false;
    }
    if (this.config.showPageIndex && !this.editor.page.index) {
      return false;
    }
    if (!this.editor.page.type) {
      return false;
    }
    if (this.editor.page.isNdkPage() && !this.editor.page.genre) {
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
    this.movedToNextFrom = from;
    this.controls.markAsPristine();
    this.editor.isDirty = false;
    if (!this.editor.page.hasChanged()) {
      if (!!from) {
        this.editor.moveToNext();
      }
      return;
    }
    this.editor.page.removeEmptyIdentifiers();
    this.editor.savePage(this.editor.page, (page: Page) => {
      if (page) {
        this.editor.page = page;
      }
    }, !!from);
  }

  public hasChanged() {
    return this.editor.page.hasChanged();
  }

  
  enterSelect(s: MatSelect, from: string) {
    s.close();
    this.onSave(from);
  }

}
