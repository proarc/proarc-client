
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { Configuration } from '../../../shared/configuration';

@Component({
  imports: [TranslateModule, FormsModule, FlexLayoutModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatRadioModule, MatFormFieldModule, MatSelectModule],
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
    public config: Configuration,
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
