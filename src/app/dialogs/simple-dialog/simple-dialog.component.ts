
import { Component, OnInit, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SimpleDialogData } from './simple-dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, MatInputModule,
    CdkDrag, CdkDragHandle, 
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule,
    FormsModule, MatFormFieldModule, MatCheckboxModule
  ],
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.scss']
})
export class SimpleDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SimpleDialogData) { }

  ngOnInit() {
  }

  btnEnabled() {
    const num = this.data.numberInput;
    if (num) {
      return num.value >= num.min && num.value <= num.max;
    }
    return true;
  }
}
