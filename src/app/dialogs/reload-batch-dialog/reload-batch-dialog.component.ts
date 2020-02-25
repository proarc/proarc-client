
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';
import { Profile } from 'src/app/model/profile.model';

@Component({
  selector: 'app-reload-batch-dialog',
  templateUrl: './reload-batch-dialog.component.html',
  styleUrls: ['./reload-batch-dialog.component.scss']
})
export class ReloadBatchDialogComponent implements OnInit {

  state = 'none';
  selectedProfile: Profile;
  profiles: Profile[] = [];

  constructor(
    public dialogRef: MatDialogRef<ReloadBatchDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.state = 'loading';
    this.api.getImportProfiles().subscribe((profiles: Profile[]) => {
      this.profiles = profiles;
      this.selectedProfile = this.profiles[0];
      this.state = 'none';
    });
  }

  onContinue() {
    this.dialogRef.close({ profile: this.selectedProfile });
  }

  formDisabled(): boolean {
    return this.state === 'loading' || !this.selectedProfile; 
  }

}
