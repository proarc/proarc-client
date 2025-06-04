import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NewMetadataDialogComponent } from '../../../dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { WorkFlow } from '../../../model/workflow.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule,
    MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatInputModule, MatButtonModule,
    MatRadioModule, MatFormFieldModule, MatSelectModule,
  ],
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {

  @Input() material: any;
  @Input() workflow: WorkFlow;

  @Output() onRefresh = new EventEmitter<boolean>();

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService) { }

  ngOnInit(): void {
  }

  save() {
    this.api.saveWorkflowMaterial(this.material).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        return;
      }
      this.material = response.response.data[0];
      this.onRefresh.emit(true);
    });
  }

  editMetadata() {
    
    //this.api.getWorkflowMods(this.material.id, this.material.model).subscribe(mods => {
      const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
        disableClose: true,
        height: '90%',
        width: '680px',
        data: {
          title: 'dialog.newMetadata.title_edit',
          isWorkFlow: true,
          isWorkFlowMaterial: true,
          jobId: this.workflow.id,
          model: this.workflow.model,
          timestamp: this.workflow.timestamp,
          content: this.material.metadata,
          selectedProfile: this.workflow.profileName
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res?.mods) {
          this.material.metadata = res.mods;
          this.save();
        }
      });

    //});
  }

}
