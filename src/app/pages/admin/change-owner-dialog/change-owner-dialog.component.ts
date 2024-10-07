import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
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
