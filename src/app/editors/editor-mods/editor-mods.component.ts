import { Component, OnInit, OnDestroy, ViewChild, ElementRef, SimpleChange, effect, input, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from '../../model/documentItem.model';
import { Mods } from '../../model/mods.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { LayoutService } from '../../services/layout-service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HighlightAuto } from 'ngx-highlightjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditorSwitcherComponent } from "../editor-switcher/editor-switcher.component";
import { MatButtonModule } from '@angular/material/button';


@Component({
  imports: [CommonModule, TranslateModule, FormsModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    HighlightAuto, EditorSwitcherComponent],
  selector: 'app-editor-mods',
  templateUrl: './editor-mods.component.html',
  styleUrls: ['./editor-mods.component.scss']
})
export class EditorModsComponent implements OnInit, OnDestroy {

  panel = input<ILayoutPanel>();
  panelType = input<string>();
  onChangePanelType = output<string>();


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


  subscriptions: Subscription[] = [];

  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog) {
    effect(() => {
      this.item = this.layout.lastSelectedItem();
      this.reload();
    });
  }

  ngOnInit() {
    // this.subscriptions.push(this.layout.shouldRefreshSelectedItem().subscribe(() => {
    //   this.reload();
    // }));
  }

  ngOnChanges(c: SimpleChange) {
    if (!this.layout.lastSelectedItem) {
      this.visible = false;
      return;
    }
    // if (this.pid) {
    //   this.reload();
    // }
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
    this.layout.clearPanelEditing();
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
    this.api.editModsXml(mods.pid, mods.content, mods.timestamp, null, ignoreValidation, this.layout.batchId, null).subscribe((resp: any) => {
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
          this.ui.showErrorDialogFromObject(resp.errors);
          this.state = 'error';
          return;
        }


        
      } else {
        this.api.getMods(mods.pid, this.layout.batchId).subscribe((response: any) => {

          if (response.errors) {
            this.state = 'error';
            this.ui.showErrorSnackBar(response.errors.mods[0].errorMessage)
          } else {
            const newMods: Mods = Mods.fromJson(response['record']);
            this.mods = newMods;
            this.editting = false;
            this.anyChange = false;
            this.layout.clearPanelEditing();
            this.state = 'success';
            // this.layout.refreshSelectedItem(true, 'metadata');
            this.ui.showInfoSnackBar(this.translator.instant('snackbar.changeSaved'), 4000);
          }
        });
      }

    });
  }

  confirmSave(title: string, message: string, ignoreValidation: boolean) {
    const data: SimpleDialogData = {
      title,
      message,
      alertClass: 'app-message',
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
    if (this.anyChange) {
      this.layout.setPanelEditing(this.panel());
    } else {
      this.layout.clearPanelEditing();
    }
  }

  onChange() {
    this.anyChange = true;
    this.layout.setPanelEditing(this.panel());
  }


  private reload() {
    // this.item = this.layout.lastSelectedItem;
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
    this.layout.clearPanelEditing();
    this.editting = false;
    this.state = 'loading';
    this.api.getMods(this.lastPid, this.layout.batchId).subscribe((mods: any) => {
      this.mods = Mods.fromJson(mods['record']);
      this.state = 'success';
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  changeEditorType(t: string) {
    this.onChangePanelType.emit(t);
  }

}
