import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { StreamProfile } from 'src/app/model/stream-profile';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  public currentPid: string;
  public inputPid: string;
  isLocked = false;

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  pdfUrl: string;
  state = 'loading';

  streamProfile: StreamProfile;
  streamProfiles: StreamProfile[] = [];

  constructor(private api: ApiService,
    private dialog: MatDialog,
    private ui: UIService) {
  }

  ngOnInit() {
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

  isImage() {
    const isIma = ['image/png', 'image/jpeg'].includes(this.streamProfile.mime);
    if (isIma) {
      setTimeout(() => {this.state = 'ok'}, 100);
    }
    return isIma;
  }

  isAudio() {
    // return ['audio/mpeg3'].includes(this.streamProfile.mime) ;
    return this.streamProfile.mime.indexOf('audio') > -1 ;
  }

  isUnsupported() {
    const isIma = ['image/tiff', 'image/jp2'].includes(this.streamProfile.mime);
    if (isIma) {
      setTimeout(() => {this.state = 'ok'}, 100);
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
    this.inputPid = pid;
    if (this.isLocked) {
      return;
    }
    this.currentPid = pid;
    this.state = 'loading';
    this.pdfUrl = this.api.getStreamUrl(pid, 'RAW');
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

}
