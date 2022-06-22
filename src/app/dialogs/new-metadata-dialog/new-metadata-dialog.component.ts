import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { UIService } from 'src/app/services/ui.service';
import { NewObjectDialogComponent } from '../new-object-dialog/new-object-dialog.component';
import { SimpleDialogData } from '../simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-new-metadata-dialog',
  templateUrl: './new-metadata-dialog.component.html',
  styleUrls: ['./new-metadata-dialog.component.scss']
})
export class NewMetadataDialogComponent implements OnInit {

  public inited = false;
  state = 'none';

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    private editor: EditorService,
    private translator: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.editor.init({
      pid: this.data.pid,
      preparation: false,
      metadata: this.data,
      isNew: true
    });
    this.inited = true;
    setTimeout(() => {
      this.editor.metadata.validate();
    }, 100);

  }

  public isPage(): boolean {
    return this.data.model === 'model:page' || this.data.model === 'model:ndkpage' || this.data.model === 'model:oldprintpage';
  }

  public isSong(): boolean {
    return this.data.model == 'model:ndkaudiopage';
  }

  // public isVolume(): boolean {
  //   return this.model === 'model:ndkperiodicalvolume';
  // }

  // public isIssue(): boolean {
  //   return this.model === 'model:ndkperiodicalissue';
  // }

  public isChronicle(): boolean {
    return this.data.model === 'model:chroniclevolume' || this.data.model === 'model:chronicletitle' || this.data.model === 'model:chroniclesupplement';
  }

  public isBdm(): boolean {
    return this.data.model === 'model:bdmarticle';
  }

  savePage() {
    let data = `model=${this.editor.page.model}`;
    data = `${data}&pid=${this.editor.page.pid}`;
    data = `${data}&xml=${encodeURIComponent(this.editor.page.toXml())}`;
    if (this.data.parent) {
      data = `${data}&parent=${this.data.parent}`;
    }
    this.api.createObject(data).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      this.editor.right.notSaved = false;
      this.state = 'success';
      this.editor.resetChanges();
      this.dialogRef.close(response['response']['data'][0]);
    });
  }

  onClose() {
    const data: SimpleDialogData = {
      title: 'Upozornění',
      message:'Opouštíte formulář bez uložení. Opravdu chcete pokračovat?',
      btn1: {
        label: "Ano",
        value: 'true',
        color: 'warn'
      },
      btn2: {
        label: "Ne",
        value: 'false',
        color: 'default'
      },
    };
    const d = this.dialog.open(SimpleDialogComponent, { data: data });
    d.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.dialogRef.close('close');
      }
    });

  }

  onSave() {
    if (this.isPage()) {
      this.savePage();
      return;
    }
    if (this.editor.metadata.validate()) {
      let data = `model=${this.editor.metadata.model}`;
      data = `${data}&pid=${this.editor.metadata.pid}`;
      data = `${data}&xml=${encodeURIComponent(this.editor.metadata.toMods())}`;
      if (this.data.parent) {
        data = `${data}&parent=${this.data.parent}`;
      }
      this.api.createObject(data).subscribe((response: any) => {
        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorSnackBarFromObject(response['response'].errors);
          this.state = 'error';
          return;
        }
        const pid = response['response']['data'][0]['pid'];
        this.state = 'success';
        this.editor.resetChanges();
        this.dialogRef.close(response['response']['data'][0]);
        //this.router.navigate(['/document', pid]);

      });
    } else {
      this.confirmSave('Nevalidní data', 'Nevalidní data, přejete si dokument přesto uložit?', true);
    }
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
        let data = `model=${this.editor.metadata.model}`;
        data = `${data}&pid=${this.editor.metadata.pid}`;
        data = `${data}&xml=${encodeURIComponent(this.editor.metadata.toMods())}`;
        if (this.data.parent) {
          data = `${data}&parent=${this.data.parent}`;
        }
        this.api.createObject(data).subscribe((response: any) => {
          if (response['response'].errors) {
            console.log('error', response['response'].errors);
            this.ui.showErrorSnackBarFromObject(response['response'].errors);
            this.state = 'error';
            return;
          }
          const pid = response['response']['data'][0]['pid'];
          this.state = 'success';
          this.editor.resetChanges();
          this.dialogRef.close(response['response']['data'][0]);

        });
      }
    });
  }

}
