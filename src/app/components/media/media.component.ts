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

  @ViewChild('pdfInput') pdfInput: ElementRef;

  public currentPid: string;

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
    const isIma = ['image/tiff', 'image/jp2', 'image/jpeg'].includes(this.streamProfile.mime);
    if (isIma) {
      setTimeout(() => {this.state = 'ok'}, 100);
    }
    return isIma;
  }

  isAudio() {
    // return ['audio/mpeg3'].includes(this.streamProfile.mime) ;
    return this.streamProfile.mime.indexOf('audio') > -1 ;
  }

  hasProfile(stream: string) {
    return this.streamProfiles.findIndex(p => p.dsid === stream) > -1;
  }

  onPidChanged(pid: string) {
    this.currentPid = pid;
    this.state = 'loading';
    this.pdfUrl = this.api.getStreamUrl(pid, 'RAW');
    this.api.getStreamProfile(pid).subscribe((response: any) => {
      if (response?.response?.data) {
        this.streamProfiles = response.response.data;
        if (this.streamProfiles.length > 0) {
          this.streamProfile = this.streamProfiles[0];
          // this.api.headStream(pid, this.streamProfile.dsid).subscribe((response: any) => {
          //   if (!response) {
          //     this.state = 'head';
          //   } else if (response?.response && response.response.status === 200) {
          //     this.state = 'head';
          //   } else if (response?.response && response.response.status === 404) {
          //     this.state = 'empty';
          //   } else {
          //     this.state = 'error';
          //   }
          // });
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

  onAdd() {
    let event = new MouseEvent('click', { bubbles: true });
    this.pdfInput.nativeElement.dispatchEvent(event);

  }

  uploadPdf(event: any) {
    console.log('uploadPdf', event);
    const files = <Array<File>>event.target.files;
    if (files.length != 1) {
      return;
    }
    this.state = 'loading';
    this.api.uploadPdf(files[0], this.currentPid).subscribe(response => {
      this.state = 'ok';
    });
  }


  onRemove() {
    const data: SimpleDialogData = {
      title: "Odstranění digitálního obsahu",
      message: "Opravdu chcete odstranit digitální obsah?",
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
    this.api.deletePdf(this.currentPid).subscribe(() => {
      this.state = 'empty';
      this.ui.showInfoSnackBar("Digitální obsah byl odstraněn");
    });
  }

}
