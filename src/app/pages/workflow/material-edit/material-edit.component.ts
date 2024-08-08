import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewMetadataDialogComponent } from 'src/app/dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { WorkFlow } from 'src/app/model/workflow.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
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
