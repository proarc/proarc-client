
import { Component, computed, effect, ElementRef, input, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { StreamProfile } from '../../model/stream-profile';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { DocumentItem } from '../../model/documentItem.model';
import { PdfComponent } from "../pdf/pdf.component";
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { EpubComponent } from "../epub/epub.component";
import { SongComponent } from "../song/song.component";
import { ViewerComponent } from "../viewer/viewer.component";
import { MatButtonModule } from '@angular/material/button';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, MatButtonModule, MatCardModule, MatSelectModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatFormFieldModule, PdfComponent, EpubComponent, SongComponent, ViewerComponent],
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {


  lastSelectedItem = input<DocumentItem>();
  numOfSelected = input<number>(1);
  uploading = false;
  uploadCompleted = 0;
  uploadTotal = 0;
  private uploadTargets: string[] = [];
  private panelLocked = signal(false);
  private currentItem = signal<DocumentItem>(null);
  uploadItems = computed(() => {
    this.numOfSelected();
    const item = this.lastSelectedItem();
    if (this.panelLocked()) {
      return this.currentItem() ? [this.currentItem()] : [];
    }
    const selected = this.layout.getSelected();
    return selected.length ? selected : item ? [item] : [];
  });

  @ViewChild('pdfInput') pdfInput: ElementRef;
  @ViewChild('epubInput') epubInput: ElementRef;
  currentPid = signal<string>(null);
  public inputPid: string;
  public currentModel: string;
  public inputModel: string;
  isLocked = false;
  isRepo = true;
  canAddPdf = false;
  canContainDigitalContent = false;
  allowedModels = [
    'model:ndkeperiodicalissue',
    'model:ndkeperiodicalsupplement',
    'model:ndkearticle',
    'model:ndkemonographvolume',
    'model:ndkemonographunit',
    'model:ndkemonographsupplement',
    'model:ndkechapter',
    'model:chroniclesupplement',
    'model:bdmarticle']

  state = 'loading';

  streamProfile: StreamProfile;
  streamProfiles: StreamProfile[] = [];
  maxImageSize: number = 6000;
  imageUrl: string;

  canAddPDF_A: boolean;

  constructor(private api: ApiService,
    private dialog: MatDialog,
    private ui: UIService,
    private layout: LayoutService,
    private translator: TranslateService,
    public settings: UserSettings) {
    effect(() => {
      const item = this.lastSelectedItem();
      if (item) {
        this.onPidChanged(item.pid, item.model);
      }
    })
  }

  ngOnInit() {
    this.isRepo = this.layout.type === 'repo';
  }

  isBigSize() {
    return this.streamProfile.width > this.maxImageSize || this.streamProfile.height > this.maxImageSize
  }

  urlByStream() {
    return this.api.getStreamUrl(this.currentPid(), this.streamProfile.dsid);
  }

  isPlainImage() {
    return ['image/jpeg'].includes(this.streamProfile.mime);
  }

  isPdf() {
    return this.streamProfile.mime === 'application/pdf';
  }

  isEpub() {
    return this.streamProfile.mime === 'application/epub+zip';
  }

  isImage() {
    const isIma = ['image/png', 'image/jpeg'].includes(this.streamProfile.mime);
    if (isIma) {
      setTimeout(() => { this.state = 'ok' }, 100);
    }
    return isIma;
  }

  isAudio() {
    // return ['audio/mpeg3'].includes(this.streamProfile.mime) ;
    return this.streamProfile.mime.indexOf('audio') > -1;
  }

  isUnsupported() {
    const isIma = ['image/tiff', 'image/jp2'].includes(this.streamProfile.mime);
    if (isIma) {
      setTimeout(() => { this.state = 'ok' }, 100);
    }
    return isIma;
  }

  hasProfile(stream: string) {
    return this.streamProfiles.findIndex(p => p.dsid === stream) > -1;
  }

  changeLockPanel() {
    this.isLocked = !this.isLocked;
    this.panelLocked.set(this.isLocked);
    if (!this.isLocked) {
      this.onPidChanged(this.inputPid, this.inputModel)
    }
  }

  onPidChanged(pid: string, model: string) {
    this.isRepo = this.layout.type === 'repo';
    this.inputPid = pid;
    this.inputModel = model;
    if (this.isLocked) {
      return;
    }
    this.currentPid.set(pid);
    this.currentModel = model;
    this.currentItem.set(this.lastSelectedItem());
    this.canAddPdf = this.allowedModels.includes(model);
    this.canContainDigitalContent = this.lastSelectedItem().canContainDigitalContent();
    if (!this.canContainDigitalContent) {
      this.streamProfiles = [];
      this.streamProfile = null;
      this.state = 'unsupported';
      return;
    }
    this.getProfiles(pid);
  }

  getProfiles(pid: string) {
    if (!this.isRepo) {
      this.streamProfiles = [];
      this.streamProfile = null;
      return;
    }
    this.canAddPDF_A = false;
    this.state = 'loading';
    this.api.getStreamProfile(pid).subscribe((response: any) => {
      if (response?.response?.data && !response?.response?.errorMessage) {
        this.streamProfiles = response.response.data;
        if (this.streamProfiles.length > 0) {
          // try FULL as default
          this.streamProfile = this.streamProfiles.find(s => s.dsid === 'FULL');
          if (!this.streamProfile) {
            this.streamProfile = this.streamProfiles[0];
          }

          this.imageUrl = this.api.getStreamUrl(this.inputPid, this.streamProfile.dsid, this.layout.batchId);
          this.canAddPDF_A = this.streamProfiles.findIndex(sp => sp.dsid === 'RAW' && sp.mime === 'application/pdf') > -1;

        } else {
          this.state = 'empty';
          this.streamProfile = null;
        }
      } else {
        this.state = 'empty';
        this.streamProfiles = [];
        this.streamProfile = null;
      }
    });
  }

  onAddPdf() {
    if (!this.canUpload()) {
      return;
    }
    this.uploadTargets = this.uploadItems().map(item => item.pid);
    this.pdfInput.nativeElement.value = '';
    this.pdfInput.nativeElement.click();
  }

  canUpload(): boolean {
    const items = this.uploadItems();
    return this.isRepo && !this.uploading && items.length > 0 &&
      items.every(item => item.pid && !item.notSaved && this.allowedModels.includes(item.model));
  }

  generatePdfA() {
    this.api.generatePdfA(this.currentPid()).subscribe((response: any) => {
      if (response.response.errors) {
        this.state = 'error';
        this.ui.showErrorDialogFromObject(response.response.errors);
      } else {
        this.state = 'success';
        this.ui.showInfoSnackBar(response.response.data[0].msg)
      }
    });
  }

  onAddEpub() {
    let event = new MouseEvent('click', { bubbles: true });
    this.epubInput.nativeElement.dispatchEvent(event);

  }

  uploadPdf(event: any) {
    //console.log('uploadPdf', event);
    const files = <Array<File>>event.target.files;
    if (files.length != 1) {
      return;
    }
    this.state = 'loading';
    this.api.uploadFile(files[0], this.currentPid(), 'application/pdf').subscribe(response => {
      this.state = 'ok';
    });
  }

  uploadEpub(event: any) {
    //console.log('uploadEpub', event);
    const files = <Array<File>>event.target.files;
    if (files.length != 1) {
      return;
    }
    this.state = 'loading';
    this.api.uploadFile(files[0], this.currentPid(), 'application/epub+zip').subscribe(response => {
      this.state = 'ok';
    });
  }

  uploadFile(event: any) {
    const files = <Array<File>>event.target.files;
    if (files.length !== 1 || this.uploading || !this.uploadTargets.length) {
      return;
    }
    const file = files[0];
    const pids = [...new Set(this.uploadTargets)];
    if (pids.length > 1 && !/\.pdf$/i.test(file.name)) {
      this.ui.showErrorDialogFromString(this.translator.instant('viewer.upload.pdfOnly'));
      event.target.value = '';
      return;
    }
    this.uploading = true;
    this.uploadCompleted = 0;
    this.uploadTotal = pids.length;
    this.state = 'loading';
    this.streamProfile = null;
    const failures: string[] = [];
    const mime = /\.pdf$/i.test(file.name) ? 'application/pdf' : file.type;
    this.api.uploadFileToObjects(file, pids, mime).subscribe({
      next: ({pid, response}) => {
        this.uploadCompleted++;
        const result = response?.response;
        if (!result || result.errors || result.errorMessage || (result.status != null && result.status !== 0)) {
          failures.push(pid);
        }
      },
      complete: () => {
        this.uploading = false;
        event.target.value = '';
        this.getProfiles(this.currentPid());
        const params = {succeeded: pids.length - failures.length, total: pids.length};
        if (failures.length) {
          this.ui.showErrorDialogFromString(
            this.translator.instant('viewer.upload.failed', params) + '\n' + failures.join('\n'));
        } else {
          this.ui.showInfoSnackBar(this.translator.instant('viewer.upload.success', params));
        }
      }
    });
  }

  onRemove() {
    const data: SimpleDialogData = {
      title: "Odstranění digitálního obsahu",
      message: "Opravdu chcete odstranit digitální obsah? (daastream " + this.streamProfile.dsid + ")",
      alertClass: 'app-message',
      btn2: {
        label: "Ne",
        value: 'no',
        color: 'default'
      },
      btn1: {
        label: "Ano",
        value: 'yes',
        color: 'warn'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { 
      data: data,
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance] 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.state = 'loading';
        this.remove();
      }
    });
  }

  remove() {
    this.api.deletePdf(this.currentPid(), this.streamProfile.dsid).subscribe(() => {
      this.state = 'empty';
      this.ui.showInfoSnackBar("Digitální obsah byl odstraněn");
      this.getProfiles(this.currentPid());
    });
  }

}
