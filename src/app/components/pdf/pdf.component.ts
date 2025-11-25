import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { MatIconModule } from '@angular/material/icon';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, 
    NgxExtendedPdfViewerModule, MatIconModule,
    MatCardModule, MatProgressBarModule, MatTooltipModule
  ],
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  @ViewChild('pdfInput') pdfInput: ElementRef;
  @ViewChild('pdfViewer') pdfViewer: ElementRef;

  stream = input<string>();
  pid = input<string>();

  private currentStream: string;
  private currentPid: string;

  pdfUrl: string;
  state = 'loading';

  constructor(private api: ApiService,
     private dialog: MatDialog,
     private ui: UIService,
     public settings: UserSettings
    ) {
      effect(() => {
        this.currentPid = this.pid();
        this.currentStream = this.stream();
        this.onPidChanged(this.currentPid);
      })
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
    this.api.deletePdf(this.currentPid, 'RAW').subscribe(() => {
      this.state = 'empty';
      this.ui.showInfoSnackBar("Digitální obsah byl odstraněn");
    });
  }

}
