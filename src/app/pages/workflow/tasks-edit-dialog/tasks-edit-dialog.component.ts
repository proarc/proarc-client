import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ConfigService } from 'src/app/services/config.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-taskss-edit-dialog',
  templateUrl: './tasks-edit-dialog.component.html',
  styleUrls: ['./tasks-edit-dialog.component.scss']
})
export class TaskssEditDialogComponent implements OnInit {

  state: string;
  priority: string;
  ownerId: string;
  isSelectionSameType: boolean;

  constructor(
    public config: ConfigService,
    private api: ApiService,
    private ui: UIService,
    public dialogRef: MatDialogRef<TaskssEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {tasks: any[]; states: any[]; priorities: any[]; users: any[]; parameters: any[]}) { }

  ngOnInit(): void {
    this.isSelectionSameType = true;
      
      let profileLabel = this.data.tasks[0].profileLabel;
      this.data.tasks.filter(i => i.selected).forEach(i => {
        if (i.profileLabel !== profileLabel) {
          this.isSelectionSameType = false;
        }
      });
      this.data.parameters.forEach(p => {p.value = null})
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    // const ids = this.data.tasks.filter(i => i.selected).map(p => p.id)
    // let data = 'ids=' + ids.join('&ids=');
    // if (this.state) {
    //   data += `&state=${this.state}`;
    // }
    // if (this.priority) {
    //   data += `&priority=${this.priority}`;
    // }
    // if (this.ownerId) {
    //   data += `&ownerId=${this.ownerId}`;
    // }

    const params: any = {};
    this.data.parameters.forEach((p: any) => {
      params[p.profileName] = p.value;
    })
    
    // data += `&params=${JSON.stringify(params)}`;

    const data = {
      ids: this.data.tasks.filter(i => i.selected).map(p => p.id),
      state: this.state,
      priority: this.priority,
      ownerId: this.ownerId,
      params: params
    }
      
      this.api.saveWorkflowTasks(data).subscribe((response: any) => {
        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorDialogFromObject(response['response'].errors);
          return;
        }
        this.dialogRef.close(true);
      });
  }

}
