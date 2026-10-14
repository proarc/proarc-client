
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewMetadataDialogComponent } from '../../../dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { CatalogDialogComponent } from '../../../dialogs/catalog-dialog/catalog-dialog.component';
import { WorkFlow } from '../../../model/workflow.model';
import { ApiService } from '../../../services/api.service';
import { UIService } from '../../../services/ui.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserSettings } from '../../../shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatInputModule, MatButtonModule, MatRadioModule, MatFormFieldModule, MatSelectModule],
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {

  @Input() material: any;
  @Input() workflow: WorkFlow;
  saving = false;
  catalogOpen = false;

  @Output() onRefresh = new EventEmitter<boolean>();

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService,
    public settings: UserSettings,
    private translator: TranslateService) { }

  ngOnInit(): void {
  }

  save(material = this.material) {
    if (this.saving) {
      return;
    }
    this.saving = true;
    this.api.saveWorkflowMaterial(material).subscribe({
      next: (response: any) => {
        this.saving = false;
        if (response['response'].errors) {
          this.ui.showErrorDialogFromObject(response['response'].errors);
          return;
        }
        this.material = response.response.data[0];
        this.onRefresh.emit(true);
      },
      error: () => {
        this.saving = false;
        this.ui.showErrorSnackBar(this.translator.instant('workflow.materialSaveError'));
      }
    });
  }

  loadFromCatalog() {
    if (this.material.type !== 'PHYSICAL_DOCUMENT' || this.saving || this.catalogOpen) {
      return;
    }
    const material = this.material;
    this.catalogOpen = true;
    const dialogRef = this.dialog.open(CatalogDialogComponent, {
      data: {type: 'full'},
      width: '1200px',
      panelClass: ['app-dialog-catalog', 'app-form-view-' + this.settings.appearance]
    });
    dialogRef.afterClosed().subscribe(result => {
      this.catalogOpen = false;
      if (result?.mods && this.material === material) {
        this.save({...material, metadata: result.mods});
      }
    });
  }

  editMetadata() {
    
    //this.api.getWorkflowMods(this.material.id, this.material.model).subscribe(mods => {
      const dialogRef = this.dialog.open(NewMetadataDialogComponent, {
        disableClose: true,
        height: '90%',
        width: '680px',
        panelClass: ['app-new-metadata-dialog', 'app-form-view-' + this.settings.appearance],
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
