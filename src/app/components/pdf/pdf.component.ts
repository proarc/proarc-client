import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { StreamProfile } from 'src/app/model/stream-profile';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  @ViewChild('pdfInput') pdfInput: ElementRef;
  @ViewChild('pdfViewer') pdfViewer: ElementRef;

  private currentStream: string;
  @Input()
  set stream(stream: string) {
    this.currentStream = stream;
    this.onPidChanged(this.currentPid);
  }

  private currentPid: string;
  @Input() 
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  pdfUrl: string;
  state = 'loading';

  constructor(private api: ApiService,
     private dialog: MatDialog,
     private ui: UIService) {
  }

  ngOnInit() {
  }

  getLang(): string {
    const lang = localStorage.getItem('lang');
    if (lang) {
      return lang;
    } else {
      return 'cs';
    }
  }

  onPidChanged(pid: string) {
    this.currentPid = pid;
    this.state = 'loading';
    this.pdfUrl = this.api.getStreamUrl(pid, this.currentStream);
    if (!pid) {
      return;
    }
    this.api.headStream(pid, 'RAW').subscribe((response: any) => {
      if (!response) {
        this.state = 'head';
      } else if (response?.response && response.response.status === 200) {
        this.state = 'head';
      } else if (response?.response && response.response.status === 404) {
        this.state = 'empty';
      } else {
        this.state = 'error';
      }
      
    });
  }

  pdfRendered(e: any) {
    this.state = 'ok';
  }

  onAdd() {
    let event = new MouseEvent('click', {bubbles: true});
    this.pdfInput.nativeElement.dispatchEvent(event);

  }

  uploadPdf(event: any) {
    console.log('uploadPdf', event);
    const files = <Array<File>>event.target.files;
    if (files.length != 1) {
      return;
    }
    this.state = 'loading';
    this.api.uploadFile(files[0], this.currentPid, 'application/pdf').subscribe(response => {
      this.state = 'ok';
    });
  }



onRemove() {
    const data: SimpleDialogData = {
      title: "Odstranění digitálního obsahu",
      message: "Opravdu chcete odstranit digitální obsah?",
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
    this.api.deletePdf(this.currentPid, 'RAW').subscribe(() => {
      this.state = 'empty';
      this.ui.showInfoSnackBar("Digitální obsah byl odstraněn");
    });
  }

}
