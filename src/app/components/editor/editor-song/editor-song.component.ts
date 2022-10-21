import { CodebookService } from './../../../services/codebook.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Page } from 'src/app/model/page.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'src/app/services/config.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-song',
  templateUrl: './editor-song.component.html',
  styleUrls: ['./editor-song.component.scss']
})
export class EditorSongComponent implements OnInit {

  @Input() notSaved = false;
  state = 'none';
  page: Page;

  positions = ['left', 'right', 'singlePage'];
  genres = ['page', 'reprePage'];

  movedToNextFrom: string;

  @Input() model: string;

  @ViewChild("pageNumber") pageNumberFiled: ElementRef;
  @ViewChild("pageIndex") pageIndexFiled: ElementRef;


  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(private layout: LayoutService,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    public config: ConfigService,
    public codebook: CodebookService,
    public translator: TranslateService) {
  }

  ngOnInit() {
  }

  removeFocus() {
    this.movedToNextFrom = '';
  }

  private onPidChanged(pid: string) {
    if (this.notSaved) {
      return;
    }
    this.state = 'loading';
    this.api.getPage(pid, this.model, this.layout.getBatchId()).subscribe((page: Page) => {
      this.page = page;
      this.state = 'success';
      if (this.movedToNextFrom == 'pageNumber') {
        setTimeout(() => {
          this.pageNumberFiled.nativeElement.focus();
        }, 10);
      } else if (this.movedToNextFrom == 'pageIndex') {
        setTimeout(() => {
          this.pageIndexFiled.nativeElement.focus();
        }, 10);
      }

    }, () => {
      this.state = 'failure';
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
    this.movedToNextFrom = from;
    if (!this.page.hasChanged()) {
      if (!!from) {
        this.layout.moveToNext();
      }
      return;
    }
    this.page.removeEmptyIdentifiers();
    this.savePage(this.page, (page: Page) => {
      if (page) {
        this.page = page;
      }
    }, !!from);
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

}
