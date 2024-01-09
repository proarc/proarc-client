import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { StreamProfile } from 'src/app/model/stream-profile';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @ViewChild('pdfInput') pdfInput: ElementRef;
  @ViewChild('epubInput') epubInput: ElementRef;
  public currentPid: string;
  public inputPid: string;
  isLocked = false;
  isRepo = true;
  canAddPdf = false;
  allowedModels = [
  'model:ndkeperiodicalissue',
  'model:ndkearticle',
  'model:ndkemonographvolume',
  'model:ndkechapter',
  'model:chroniclesupplement',
  'model:bdmarticle']

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  // pdfUrl: string;
  state = 'loading';

  streamProfile: StreamProfile;
  streamProfiles: StreamProfile[] = [];

  constructor(private api: ApiService,
    private dialog: MatDialog,
    private ui: UIService,
    private layout: LayoutService) {
  }

  ngOnInit() {
    this.isRepo = this.layout.type === 'repo';
  }

  urlByStream() {
    return this.api.getStreamUrl(this.currentPid, this.streamProfile.dsid);
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
    if (!this.isLocked) {
      this.onPidChanged(this.inputPid)
    }
  }

  onPidChanged(pid: string) {
    this.isRepo = this.layout.type === 'repo';
    this.inputPid = pid;
    if (this.isLocked) {
      return;
    }
    this.currentPid = pid;
    this.canAddPdf = this.allowedModels.includes(this.layout.lastSelectedItem.model);
    this.getProfiles(pid);
  }

  getProfiles(pid: string) {
    if (!this.isRepo) {
      this.streamProfiles = [];
      this.streamProfile = null;
      return;
    }
    this.state = 'loading';
    this.api.getStreamProfile(pid).subscribe((response: any) => {
      if (response?.response?.data) {
        this.streamProfiles = response.response.data;
        if (this.streamProfiles.length > 0) {
          // try FULL as default
          this.streamProfile = this.streamProfiles.find(s => s.dsid === 'FULL');
          if (!this.streamProfile) {
            this.streamProfile = this.streamProfiles[0];
          }

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
    let event = new MouseEvent('click', { bubbles: true });
    this.pdfInput.nativeElement.dispatchEvent(event);

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
    this.api.uploadFile(files[0], this.currentPid, 'application/pdf').subscribe(response => {
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
    this.api.uploadFile(files[0], this.currentPid, 'application/epub+zip').subscribe(response => {
      this.state = 'ok';
    });
  }

  uploadFile(event: any) {
    console.log('uploadEpub', event);
    const files = <Array<File>>event.target.files;
    if (files.length != 1) {
      return;
    }
    this.state = 'loading';
    this.api.uploadFile(files[0], this.currentPid, files[0].type).subscribe(response => {
      this.state = 'ok';
      this.getProfiles(this.currentPid);
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
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.state = 'loading';
        this.remove();
      }
    });
  }

  remove() {
    this.api.deletePdf(this.currentPid, this.streamProfile.dsid).subscribe(() => {
      this.state = 'empty';
      this.ui.showInfoSnackBar("Digitální obsah byl odstraněn");
      this.getProfiles(this.currentPid);
    });
  }

}
