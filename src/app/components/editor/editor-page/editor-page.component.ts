import { CodebookService } from './../../../services/codebook.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { Page } from 'src/app/model/page.model';
import { Translator } from 'angular-translator';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements OnInit {

  state = 'none';
  page: Page;

  positions = ['left', 'right', 'singlePage'];
  genres = ['page', 'reprePage'];

  movedToNextFrom: string;

  @Input() ndk: boolean = false;

  @ViewChild("pageNumber") pageNumberFiled: ElementRef;
  @ViewChild("pageIndex") pageIndexFiled: ElementRef;


  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(private editor: EditorService,
              private api: ApiService,
              public config: ConfigService,
              public codebook: CodebookService,
              public translator: Translator) {
  }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.api.getPage(pid, this.ndk, this.editor.getBatchId()).subscribe((page: Page) => {
      this.page = page;
      this.state = 'success';
      if (this.movedToNextFrom == 'pageNumber') {
        setTimeout(() => { 
          this.pageNumberFiled.nativeElement.focus();
        },10);
      } else if (this.movedToNextFrom == 'pageIndex') {
        setTimeout(() => { 
          this.pageIndexFiled.nativeElement.focus();
        },10);
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

  onSave(from: string = null) {
    this.movedToNextFrom = from;
    if (!this.page.hasChanged()) {
      if (!!from) {
        this.editor.moveToNext();
      }
      return;
    }
    this.page.removeEmptyIdentifiers();
    this.editor.savePage(this.page, (page: Page) => {
      if (page) {
        this.page = page;
      }
    }, !!from);
  }

}
