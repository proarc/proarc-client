import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReloadBatchDialogComponent } from '../reload-batch-dialog/reload-batch-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule
  ],
  selector: 'app-resolve-conflict-dialog',
  templateUrl: './resolve-conflict-dialog.component.html',
  styleUrls: ['./resolve-conflict-dialog.component.scss']
})
export class ResolveConflictDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReloadBatchDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  useNew() {
    this.dialogRef.close({ useNewMetadata: true });
  }

  useOriginal() {
    this.dialogRef.close({ useNewMetadata: false });
  }

  close() {
    this.dialogRef.close(false);
  }

}
