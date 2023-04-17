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
import {AudioPage} from '../../../model/audioPage.model';

@Component({
  selector: 'app-editor-audioPage',
  templateUrl: './editor-audioPage.component.html',
  styleUrls: ['./editor-audioPage.component.scss']
})
export class EditorAudioPageComponent implements OnInit {

  @Input() notSaved = false;
  state = 'none';
  audioPage: AudioPage;

  movedToNextFrom: string;

  @Input() model: string;
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
    this.api.getAudioPage(pid, this.model, this.layout.getBatchId()).subscribe((audioPage: AudioPage) => {
      this.audioPage = audioPage;
      this.state = 'success';
      if (this.movedToNextFrom == 'pageIndex') {
        setTimeout(() => {
          this.pageIndexFiled.nativeElement.focus();
        }, 10);
      }

    }, () => {
      this.state = 'failure';
    });
  }

  onRevert() {
    this.audioPage.restore();
  }

  onSaveFrom(from: string) {
    this.onSave(from);
  }

  private validate(): boolean {
    if (this.config.showPageIndex && !this.audioPage.index) {
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
    if (!this.audioPage.hasChanged()) {
      if (!!from) {
        this.layout.shouldMoveToNext(from);
      }
      return;
    }
    this.audioPage.removeEmptyIdentifiers();
    this.saveSong(this.audioPage, (audioPage: AudioPage) => {
      if (audioPage) {
        this.audioPage = audioPage;
      }
    }, !!from);
  }



  saveSong(audioPage: AudioPage, callback: (audioPage: AudioPage) => void, moveToNext = false) {
    this.state = 'saving';
    this.api.editAudioPage(audioPage, this.layout.getBatchId()).subscribe((resp: any) => {
      if (resp.response.errors) {
        this.ui.showErrorDialogFromObject(resp.response.errors);
        this.state = 'error';
        return;
      }
      const newAudioPage: AudioPage = AudioPage.fromJson(resp['response']['data'][0], audioPage.model);
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

}
