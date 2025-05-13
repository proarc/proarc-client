import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '../../../model/user.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule,
    MatIconModule, MatButtonModule, MatProgressBarModule, MatDialogModule,
    MatInputModule, MatTooltipModule, MatCheckboxModule, MatFormFieldModule,
    MatSelectModule
  ],
  selector: 'app-change-owner-dialog',
  templateUrl: './change-owner-dialog.component.html',
  styleUrls: ['./change-owner-dialog.component.scss']
})
export class ChangeOwnerDialogComponent implements OnInit {

  oldOwner: string;
  newOwner: string;
  state: string;

  constructor(
    public dialogRef: MatDialogRef<ChangeOwnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User[],
    private translator: TranslateService,
    private ui: UIService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
  }

  changeOwner() {
    this.state = 'loading';
    this.api.changeOwner(this.oldOwner, this.newOwner).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
      } else {
        this.ui.showInfoSnackBar(String(this.translator.instant('snackbar.changeOwner.success')));
        this.state = 'success';
      }

    })

  }

}
