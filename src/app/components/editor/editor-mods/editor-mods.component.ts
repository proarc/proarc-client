import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, SimpleChange } from '@angular/core';
import { Mods } from 'src/app/model/mods.model';
import { ApiService } from 'src/app/services/api.service';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Subscription } from 'rxjs';
import { RepositoryService } from 'src/app/services/repository.service';
import { UIService } from 'src/app/services/ui.service';
import { Metadata } from 'src/app/model/metadata.model';
import { LayoutService } from 'src/app/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-editor-mods',
  templateUrl: './editor-mods.component.html',
  styleUrls: ['./editor-mods.component.scss']
})
export class EditorModsComponent implements OnInit, OnDestroy {

  @Input() pid: string;
  @ViewChild('editingPre') editingPre: ElementRef;
  @ViewChild('originalPre') originalPre: ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  mods: Mods;
  anyChange: boolean;
  lastPid: string;

  originalText = '';


  item: DocumentItem;

  public visible = true;

  private rightDocumentSubscription: Subscription;
  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    // this.layout.selectionChanged().subscribe(() => {
    //   this.reload();
    // });
    // this.reload();
  }

  ngOnChanges(c: SimpleChange) {
    if (!this.layout.lastSelectedItem) {
      this.visible = false;
      return;
    }
    if (this.pid) {
      this.reload();
    }
  }

  public setRealtime(enable: boolean) {
    if (enable) {
      this.onClear();
    } else {
      this.loadMods();
    }
    this.realtime = enable;
  }

  onEdit() {
    if (this.realtime) {
      return;
    }
    this.originalText = this.originalPre.nativeElement.innerText;
    this.editting = true;
  }

  onClear() {
    if (this.realtime) {
      return;
    }
    this.editting = false;
    this.anyChange = false;
    this.mods.restore();
  }

  onRefresh() {
    if (this.editting || this.realtime) {
      return;
    }
    this.loadMods();
  }

  onSave() {
    // console.log(this.editingPre);
    // return;
    if (!this.anyChange || this.realtime) {
      return;
    }
    this.mods.content = this.editingPre.nativeElement.innerText;
    this.saveMods(this.mods, false);
  }

  saveMods(mods: Mods, ignoreValidation: boolean) {
    this.state = 'saving';
    this.api.editModsXml(mods.pid, mods.content, mods.timestamp, ignoreValidation, this.layout.getBatchId()).subscribe((resp: any) => {
      if (resp.errors) {
        this.state = 'error';
        // if (resp.errors.mods) {
        //   this.ui.showErrorSnackBar(resp.errors.mods[0].errorMessage)
        // }
        // if (resp.errors['mods.identifier']) {
        //   this.ui.showErrorSnackBar(resp.errors['mods.identifier'][0].errorMessage)
        // }


        if (resp.status === -4) {
          // Ukazeme dialog a posleme s ignoreValidation=true
          //this.state = 'error';
          const messages = this.ui.extractErrorsAsString(resp.errors);
          if (resp.data === 'cantIgnore') {
            this.ui.showErrorSnackBar(messages);
          } else {
            this.confirmSave(this.translator.instant('common.warning'), messages, true);
          }
          return;
        } else {
          this.ui.showErrorSnackBarFromObject(resp.errors);
          this.state = 'error';
          return;
        }


        
      } else {
        this.api.getMods(mods.pid, this.layout.getBatchId()).subscribe((response: any) => {

          if (response.errors) {
            this.state = 'error';
            this.ui.showErrorSnackBar(response.errors.mods[0].errorMessage)
          } else {
            const newMods: Mods = Mods.fromJson(response['record']);
            this.mods = newMods;
            this.editting = false;
            this.anyChange = false;
            this.state = 'success';
            this.layout.refreshSelectedItem(true, 'metadata');
          }
        });
      }

    });
  }

  confirmSave(title: string, message: string, ignoreValidation: boolean) {
    const data: SimpleDialogData = {
      title,
      message,
      btn1: {
        label: "Uložit",
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
        this.saveMods(this.mods, true);
      }
    });
  }

  checkChanged() {
    //console.log(this.editingPre.nativeElement.innerText, this.originalText)
    this.anyChange = this.editingPre.nativeElement.innerText !== this.originalText;
  }

  onChange() {
    this.anyChange = true;
  }


  private reload() {
    this.item = this.layout.lastSelectedItem;
    if (this.item) {
      this.visible = true;
      this.lastPid = this.item.pid;
      this.setRealtime(false);
    } else {
      this.visible = false;
    }
  }

  private loadMods() {
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getMods(this.lastPid, this.layout.getBatchId()).subscribe((mods: any) => {
      this.mods = Mods.fromJson(mods['record']);
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

  ngOnDestroy() {
    if (this.rightDocumentSubscription) {
      this.rightDocumentSubscription.unsubscribe();
    }
  }

}
