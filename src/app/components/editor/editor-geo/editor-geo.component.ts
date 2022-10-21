
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-geo',
  templateUrl: './editor-geo.component.html',
  styleUrls: ['./editor-geo.component.scss']
})
export class EditorGeoComponent implements OnInit {

  state = 'none';

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  public metadata: Metadata;
  constructor(
    private api: ApiService,
    private ui: UIService,
    private translator: TranslateService,
    public layout: LayoutService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.load();
  }

  load() {
    this.state = 'loading';
    this.api.getMetadata(this.pid, this.layout.selectedItem.model).subscribe((metadata: Metadata) => {
      this.metadata = metadata;
      this.state = 'success';
    });

  }

  saveMetadata(ignoreValidation: boolean) {
    this.state = 'saving';
    this.api.editMetadata(this.metadata, ignoreValidation).subscribe((response: any) => {
      if (response.errors) {
        if (response.status === -4) {
          // Ukazeme dialog a posleme s ignoreValidation=true
          //this.state = 'error';
          const messages = this.ui.extractErrorsAsString(response.errors);
          if (response.data === 'cantIgnore') {
            this.ui.showErrorSnackBar(messages);

          } else {
            this.confirmSave(this.translator.instant('common.warning'), messages, true);
          }
          return;
        } else {
          this.ui.showErrorSnackBarFromObject(response.errors);
          this.state = 'error';
          return;
        }
      }
    });
  }

  onSave() {
    this.saveMetadata(false);
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
        this.saveMetadata(ignoreValidation);
      }
    });
  }

}
