import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-jobs-edit-dialog',
  templateUrl: './jobs-edit-dialog.component.html',
  styleUrls: ['./jobs-edit-dialog.component.scss']
})
export class JobsEditDialogComponent implements OnInit {

  state: string;
  priority: string;
  financed: string;
  note: string;

  constructor(
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<JobsEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {ids: string[]; states: any[]; priorities: any[]}) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    let data = 'ids=' + this.data.ids.join('&ids=');
    if (this.state) {
      data += `&state=${this.state}`;
    }
    if (this.priority) {
      data += `&priority=${this.priority}`;
    }
    if (this.financed) {
      data += `&financed=${this.financed}`;
    }
    if (this.note) {
      data += `&note=${this.note}`;
    }
      
      this.api.saveWorkflowItems(data).subscribe((response: any) => {
        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorDialogFromObject(response['response'].errors);
          return;
        }
        this.dialogRef.close(true);
      });
  }

}
