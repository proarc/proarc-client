import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HelpDialogComponent } from 'src/app/dialogs/help-dialog/help-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Mods } from 'src/app/model/mods.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { parseString, processors, Builder } from 'xml2js';

@Component({
  selector: 'app-editor-premis',
  templateUrl: './editor-premis.component.html',
  styleUrls: ['./editor-premis.component.scss']
})
export class EditorPremisComponent implements OnInit {

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  editorType = 'metadata';

  @ViewChild('editingPre') editingPre: ElementRef;
  @ViewChild('originalPre') originalPre: ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  mods: Mods;
  anyChange: boolean;
  lastPid: string;

  originalText = '';

  // metadata: Metadata;

  item: DocumentItem;

  public visible = true;
  jsonPremis: any;

  constructor(
    private dialog: MatDialog, 
    private translator: TranslateService,
    public layout: LayoutService,
    private api: ApiService,
    private ui: UIService,) { }

  ngOnInit(): void {
  }

  onPidChanged(pid: string) {
    // this.loadData(pid)
    this.reload();
  }

  // loadData(pid: string) {
  //   this.api.getPremis(pid).subscribe((resp: any) => {
  //     this.parseXml(resp.record.content)
  //   });
  // }

  private parseXml(mods: string) {
    const xml = mods.replace(/xmlns.*=".*"/g, '');
    const data = { explicitCharkey: true };
    const ctx = this;
    parseString(xml, data, function (err: any, result: any) {
      ctx.processPremis(result);
    });
  }

  processPremis(json: any) {
    this.jsonPremis = json;

    console.log(this.jsonPremis)
    this.jsonPremis['mets:mets']['$'] = {
      'xmlns:mets': "http://www.loc.gov/METS/",
      'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
      'xmlns:premis': "info:lc/xmlns/premis-v2"
    };
    // this.jsonPremis['mets:mets'].['amdSec'].forEach((amdSec: any) => {
    //   amdSec.['techMD'].forEach((techMD: any) => {
    //     techMD.['mdWrap'].forEach((w: any) => {
    //       w.['xmlData'].forEach((x: any) => {
    //         x.['object'].forEach((o: any) => {
    //           o['$'] = null;
    //         })
    //       });
    //     });
    //   })
    // });
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

  onSaveMetadata() {

    const isValid = this.isValid();
    if (!isValid) {
      this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', true);
      return;
    }

    // xmlns: xmlns:mets="http://www.loc.gov/METS/" xmlns:nk="info:ndk/xmlns/nk-v1"
    const builder = new Builder({ 'headless': true });
    const xml = builder.buildObject(this.jsonPremis);
    this.mods.content = xml;
    this.savePremis(this.mods, false);
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
        const builder = new Builder({ 'headless': true });
        const xml = builder.buildObject(this.jsonPremis);
        this.mods.content = xml;
        this.savePremis(this.mods, true);
      } 
    });
  }

  onSave() {
    // console.log(this.editingPre);
    // return;
    if (!this.anyChange || this.realtime) {
      return;
    }
    this.mods.content = this.editingPre.nativeElement.innerText;
    this.savePremis(this.mods, false);

  }

  savePremis(mods: Mods, ignoreValidation: boolean) {
    this.state = 'saving';
    this.api.savePremis(mods.pid, mods.content, mods.timestamp, ignoreValidation, this.layout.getBatchId()).subscribe((resp: any) => {
      if (resp.errors) {
        this.state = 'error';
        this.ui.showErrorSnackBar(resp.errors.mods[0].errorMessage)
      } else {
        this.api.getPremis(this.lastPid).subscribe((response: any) => {

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

  isValid() {
    const el: any = document.querySelectorAll('.ng-invalid input, .ng-invalid mat-select')[0];
    console.log(el)
    if (el) {
      el.focus();
      return false;
    }
    return true;
  }

  checkChanged() {
    //console.log(this.editingPre.nativeElement.innerText, this.originalText)
    this.anyChange = this.editingPre.nativeElement.innerText !== this.originalText;
  }

  onChange() {
    this.anyChange = true;
  }

  createIfNotExists(root: any[], fields: string[]){
    const items: any[] = [];
    root.forEach(r => {
      fields.forEach(f => {
        if (r['premis:' + f][0] === '') {
          r['premis:' + f][0] = {_: ''};
        }
        items.push(r['premis:' + f][0]);
      });
    });
    return items;
  }


  private reload() {
    this.item = this.layout.lastSelectedItem;
    if (this.item) {
      this.visible = true;
      this.lastPid = this.item.pid;
      this.setRealtime(false);
      // this.loadMods();
    } else {
      this.visible = false;
    }
  }

  private loadMods() {
    this.mods = null;
    this.jsonPremis = null;
    this.anyChange = false;
    this.editting = false;
    this.state = 'loading';
    this.api.getPremis(this.lastPid).subscribe((response: any) => {
      if (response && response['record']) {
        this.mods = Mods.fromJson(response['record']);
        this.parseXml(response.record.content);
        this.state = 'success';
      } else if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
      } else {
        this.state = 'success';
      }
    });
  }

  addDigiprovMD(c: any) {
    const n = JSON.parse(JSON.stringify(c));
    this.jsonPremis.mets.amdSec[0].digiprovMD.push(n)
  }

  addAfterItem(parent: any, item: any, idx: number) {
    const newItem = JSON.parse(JSON.stringify(item));
    parent.splice(idx, 0, newItem)
  }

  removeItem(parent: any, item: any, idx: number) {
    parent.splice(idx, 1)
  }

  switchCollapsed(item: any) {
    item.collapsed = !item.collapsed;
  }

  openHelpDialog(data: any, item: any) {
    const label = this.translator.instant('premis.' + data.labelKey);
    let help = `
        <h2>${label} <code>${data.selector || ''}</code></h2><br/>`;
    data.help.forEach((h: string) => {
      help += h + '<br/>'
    })
    this.dialog.open(HelpDialogComponent, { data: help });
  }


  moveDown(item: any, idx: number) {

  }

  moveUp(item: any, idx: number) {

  }

}
