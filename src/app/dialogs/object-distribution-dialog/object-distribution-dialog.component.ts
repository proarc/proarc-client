import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, map } from 'rxjs';
import { DocumentItem } from '../../model/documentItem.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { ObjectTargetSelectionDialogComponent } from '../object-target-selection-dialog/object-target-selection-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import {
  buildObjectDistributionRequest,
  ObjectDistributionMode,
  splitDistributionPages,
  validateObjectDistribution
} from '../../model/object-distribution.model';

export interface ObjectDistributionDialogData {
  source: DocumentItem;
  sourcePid: string;
  pages: DocumentItem[];
  batchId: string | number | null;
  expandedPath: string[];
  displayedColumns: string[];
  columnsSettings: string;
  isRepo: boolean;
}

@Component({
  selector: 'app-object-distribution-dialog',
  imports: [FormsModule, TranslateModule, MatDialogModule, MatButtonModule, MatCheckboxModule,
    MatIconModule, MatProgressBarModule, MatRadioModule, MatFormFieldModule, MatSelectModule, MatTooltipModule],
  templateUrl: './object-distribution-dialog.component.html',
  styleUrl: './object-distribution-dialog.component.scss'
})
export class ObjectDistributionDialogComponent implements OnInit, OnDestroy {
  mode: ObjectDistributionMode = 'pageRepre';
  pageType = 'titlePage';
  runReindex = true;
  targets: DocumentItem[] = [];
  groups: DocumentItem[][] = [];
  validationKey: string | null = null;
  calculating = true;
  saving = false;
  private calculationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ObjectDistributionDialogData,
    private dialogRef: MatDialogRef<ObjectDistributionDialogComponent>,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService,
    private translator: TranslateService,
    public settings: UserSettings
  ) { }

  ngOnInit(): void {
    this.scheduleRecalculation();
  }

  ngOnDestroy(): void {
    if (this.calculationTimer !== null) {
      clearTimeout(this.calculationTimer);
    }
  }

  get busy(): boolean {
    return this.calculating || this.saving;
  }

  scheduleRecalculation(): void {
    this.calculating = true;
    if (this.calculationTimer !== null) {
      clearTimeout(this.calculationTimer);
    }

    // Run in the next task so Angular can render the progress indicator first.
    this.calculationTimer = setTimeout(() => {
      this.groups = splitDistributionPages(this.data.pages, this.mode, this.pageType);
      this.validationKey = validateObjectDistribution(
        this.data.sourcePid,
        this.data.pages,
        this.targets,
        this.groups
      );
      this.calculating = false;
      this.calculationTimer = null;
    });
  }

  firstPageLabel(index: number): string {
    const page = this.groups[index]?.[0];
    return page?.label || page?.pid || '-';
  }

  lastPageLabel(index: number): string {
    const group = this.groups[index];
    const page = group?.[group.length - 1];
    return page?.label || page?.pid || '-';
  }

  openHelpDialog(): void {
    this.dialog.open(HelpDialogComponent, {
      data: this.translator.instant('editor.children.distribution.help'),
      panelClass: ['app-dialog-help', 'app-form-view-' + this.settings.appearance]
    });
  }

  addTarget(): void {
    const picker = this.dialog.open(ObjectTargetSelectionDialogComponent, {
      data: {
        pages: this.data.pages,
        expandedPath: this.data.expandedPath,
      },
      width: '95%',
      maxWidth: '100vw',
      height: '90%',
      panelClass: ['app-dialog-parent', 'app-form-view-' + this.settings.appearance]
    });
    picker.afterClosed().subscribe((result: DocumentItem | DocumentItem[] | undefined) => {
      if (result) {
        const selectedTargets = Array.isArray(result) ? result : [result];
        const existingPids = new Set(this.targets.map(target => target.pid));
        this.targets = [
          ...this.targets,
          ...selectedTargets.filter(target => !existingPids.has(target.pid))
        ];
        this.scheduleRecalculation();
      }
    });
  }

  removeTarget(index: number): void {
    this.targets = this.targets.filter((_, targetIndex) => targetIndex !== index);
    this.scheduleRecalculation();
  }

  moveTarget(index: number, offset: number): void {
    const destination = index + offset;
    if (destination < 0 || destination >= this.targets.length) {
      return;
    }
    const targets = [...this.targets];
    moveItemInArray(targets, index, destination);
    this.targets = targets;
    this.scheduleRecalculation();
  }

  submit(): void {
    if (this.busy || this.validationKey) {
      return;
    }
    this.saving = true;
    const request = buildObjectDistributionRequest(
      this.data.sourcePid,
      this.data.batchId,
      this.runReindex,
      this.targets,
      this.groups
    );

    this.api.distributeObjectMembers(request).subscribe((response: any) => {
      if (response.response?.errors) {
        this.ui.showErrorDialogFromObject(response.response.errors);
        this.saving = false;
        return;
      }

      const targetPids = request.targets.map(target => target.dstPid);
      const sourceRefresh = this.data.isRepo
        ? this.api.getRelations(request.srcPid)
        : this.api.getBatchPages(String(this.data.batchId)).pipe(map((batchResponse: any) =>
          DocumentItem.pagesFromJsonArray(batchResponse.response.data)));
      forkJoin([sourceRefresh, ...targetPids.map(pid => this.api.getRelations(pid))]).subscribe({
        next: relations => {
          this.ui.showInfoSnackBar(this.translator.instant('editor.children.distribution.success'), 4000);
          this.dialogRef.close({ sourcePid: request.srcPid, sourceItems: relations[0], targetPids });
        },
        error: () => {
          this.saving = false;
        }
      });
    });
  }
}
