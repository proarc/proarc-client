
import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Profile } from '../../model/profile.model';
import { ApiService } from '../../services/api.service';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule,
    FormsModule, MatFormFieldModule, MatSelectModule
  ],
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
