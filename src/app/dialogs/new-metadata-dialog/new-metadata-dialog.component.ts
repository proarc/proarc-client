import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { UIService } from 'src/app/services/ui.service';
import { NewObjectDialogComponent } from '../new-object-dialog/new-object-dialog.component';

@Component({
  selector: 'app-new-metadata-dialog',
  templateUrl: './new-metadata-dialog.component.html',
  styleUrls: ['./new-metadata-dialog.component.scss']
})
export class NewMetadataDialogComponent implements OnInit {

  public inited  = false;

  constructor(
    public dialogRef: MatDialogRef<NewObjectDialogComponent>,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog,
    private editor: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.editor.init({
      pid: this.data.pid,
      preparation: false,
      metadata: this.data,
      isNew: true
    });
    this.inited = true;
    console.log(this.editor)
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

}
