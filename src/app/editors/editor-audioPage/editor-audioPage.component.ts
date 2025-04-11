import { Component, OnInit, Input, ViewChild, ElementRef, effect, input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { AudioPage } from '../../model/audioPage.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { EditorSwitcherComponent } from '../editor-switcher/editor-switcher.component';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, FlexLayoutModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  selector: 'app-editor-audioPage',
  templateUrl: './editor-audioPage.component.html',
  styleUrls: ['./editor-audioPage.component.scss']
})
export class EditorAudioPageComponent implements OnInit {
  
  panel = input<ILayoutPanel>();
  pid = input<string>();
  model = input<string>();
  notSaved = input<boolean>();
  state = 'none';
  audioPage: AudioPage;

  movedToNextFrom: string;
  @ViewChild("pageIndex") pageIndexFiled: ElementRef;

  constructor(private layout: LayoutService,
    private ui: UIService,
    private api: ApiService,
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
    this.movedToNextFrom = '';
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.api.getAudioPage(pid, this.model(), this.layout.batchId).subscribe((audioPage: AudioPage) => {
      this.audioPage = audioPage;
      this.layout.clearPanelEditing();
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

  hasChanged() {
    const hasChanges = this.audioPage.hasChanged()
    if (hasChanges) {
      this.layout.setPanelEditing(this.panel());
    } else {
      if (this.panel().canEdit) {
        this.layout.clearPanelEditing();
      }
    }
    return hasChanges;
  }

  onRevert() {
    this.audioPage.restore();
    this.layout.clearPanelEditing();
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
    this.api.editAudioPage(audioPage, this.layout.batchId).subscribe((resp: any) => {
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
