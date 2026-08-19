import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sort } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { AngularSplitModule } from 'angular-split';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { UserTreeTableComponent } from '../../components/user-tree-table/user-tree-table.component';
import { DocumentItem, TreeDocumentItem } from '../../model/documentItem.model';
import { ModelTemplate } from '../../model/modelTemplate';
import { User } from '../../model/user.model';
import { ApiService } from '../../services/api.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';

export interface ObjectTargetSelectionDialogData {
  pages: DocumentItem[];
  expandedPath: string[];
  mode?: 'distribution' | 'import';
}

@Component({
  selector: 'app-object-target-selection-dialog',
  imports: [CommonModule, FormsModule, TranslateModule, AngularSplitModule, CdkDrag, CdkDragHandle,
    MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatProgressBarModule, MatSelectModule, MatTooltipModule, UserTableComponent, UserTreeTableComponent],
  templateUrl: './object-target-selection-dialog.component.html',
  styleUrl: './object-target-selection-dialog.component.scss'
})
export class ObjectTargetSelectionDialogComponent implements OnInit {
  state = 'loading';
  items: DocumentItem[] = [];
  selectedTargets: DocumentItem[] = [];
  selectedRootTreeItem = signal<TreeDocumentItem>(null);
  expandedPath = signal<string[]>([]);

  models: string[] = [];
  users: User[] = [];
  searchMode = 'phrase';
  query = '';
  queryField: string;
  queryLabel: string;
  queryIdentifier: string;
  queryCreator: string;
  organization: string;
  owner: string;
  processor: string;
  sortField: string;
  sortAsc: boolean;
  pageIndex = 0;

  searchedModel: string;
  searchedQuery: string;
  searchedQueryLabel: string;
  searchedIdentifier: string;
  searchedOwner: string;
  searchedProcessor: string;
  private lastSearchClickIndex = -1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ObjectTargetSelectionDialogData,
    private dialogRef: MatDialogRef<ObjectTargetSelectionDialogComponent>,
    private api: ApiService,
    public config: Configuration,
    public settings: UserSettings,
    private settingsService: UserSettingsService
  ) { }

  ngOnInit(): void {
    this.models = this.config.models;
    this.sortField = this.settings.parentSortField;
    this.sortAsc = this.settings.parentSortAsc;
    this.queryField = this.settings.parentQueryField;
    this.organization = this.settings.parentOrganization;
    this.owner = this.settings.parentOwner;
    this.processor = this.settings.parentProcessor;
    this.expandedPath.set([...(this.data.expandedPath || [])]);
    this.api.getUsers().subscribe((users: User[]) => this.users = users);
    this.reload();
  }

  reload(page = 0): void {
    this.lastSearchClickIndex = -1;
    this.settings.parentSortField = this.sortField;
    this.settings.parentSortAsc = this.sortAsc;
    this.settings.parentQueryField = this.queryField;
    this.settings.parentOwner = this.owner;
    this.settings.parentProcessor = this.processor;
    this.settings.parentOrganization = this.organization;
    this.settingsService.save();

    this.pageIndex = page;
    this.state = 'loading';
    const options = {
      type: this.searchMode,
      model: this.settings.parentModel,
      query: this.query,
      queryField: this.queryField,
      page: this.pageIndex,
      sortField: this.sortField,
      sortAsc: this.sortAsc,
      organization: this.organization,
      queryLabel: this.queryLabel,
      queryIdentifier: this.queryIdentifier,
      queryCreator: this.queryCreator,
      owner: this.owner,
      processor: this.processor
    };
    this.api.getSearchResults(options).subscribe(([items]: [DocumentItem[], number]) => {
      const selectedPids = new Set(this.selectedTargets.map(item => item.pid));
      this.items = items;
      this.items.forEach(item => item.selected = selectedPids.has(item.pid));
      this.state = 'success';
    });
    this.searchedModel = options.model;
    this.searchedQuery = options.query;
    this.searchedQueryLabel = options.queryLabel;
    this.searchedIdentifier = options.queryIdentifier;
    this.searchedOwner = options.owner;
    this.searchedProcessor = options.processor;
  }

  selectSearchTarget(e: {item: DocumentItem, event?: MouseEvent, idx?: number}): void {
    const index = e.idx ?? -1;
    if (e.event?.shiftKey && this.lastSearchClickIndex > -1 && index > -1) {
      const from = Math.min(this.lastSearchClickIndex, index);
      const to = Math.max(this.lastSearchClickIndex, index);
      for (let i = from; i <= to; i++) {
        this.addTarget(this.items[i]);
      }
    } else if (e.event && (e.event.ctrlKey || e.event.metaKey)) {
      this.toggleTarget(e.item);
    } else {
      if (this.data.mode !== 'import') {
        this.clearTargets();
      }
      this.addTarget(e.item);
    }
    this.lastSearchClickIndex = index;
    this.showTree(e.item);
  }

  sortTable(sort: Sort): void {
    this.sortField = sort.active;
    this.sortAsc = sort.direction === 'asc';
    this.reload();
  }

  onTreeSelection(e: any): void {
    const selectedItems: DocumentItem[] = e.selectedItems || [];
    if (this.data.mode === 'import') {
      selectedItems.forEach(item => this.addTarget(item));
      return;
    }

    const selectedPids = new Set(selectedItems.map(item => item.pid));
    const visiblePids = new Set((e.visibleItems || []).map((item: DocumentItem) => item.pid));

    if (!e.event?.ctrlKey && !e.event?.metaKey && !e.event?.shiftKey) {
      this.clearTargets();
    } else {
      this.selectedTargets = this.selectedTargets.filter(item =>
        !visiblePids.has(item.pid) || selectedPids.has(item.pid));
    }
    selectedItems.forEach(item => this.addTarget(item));
    this.selectedTargets = [...this.selectedTargets];
  }

  confirm(): void {
    if (!this.isAllowed() || this.state === 'loading') {
      return;
    }

    if (this.data.mode === 'import') {
      this.dialogRef.close(this.selectedTargets);
      return;
    }

    this.state = 'loading';
    const childrenRequests = this.selectedTargets.map(target =>
      target.model === 'model:ndkperiodicalissue'
        ? this.api.getRelations(target.pid)
        : of([] as DocumentItem[])
    );

    forkJoin(childrenRequests).subscribe({
      next: childrenByTarget => {
        const supplementsByTarget = childrenByTarget.map(children =>
          children.filter(child => child.model === 'model:ndkperiodicalsupplement')
        );
        const automaticSupplementPids = new Set(
          supplementsByTarget.flatMap(supplements => supplements.map(supplement => supplement.pid))
        );
        const targets: DocumentItem[] = [];
        const targetPids = new Set<string>();
        this.selectedTargets.forEach((target, index) => {
          if (automaticSupplementPids.has(target.pid)) {
            return;
          }
          this.addUniqueTarget(targets, targetPids, target);
          supplementsByTarget[index]
            .forEach(supplement => this.addUniqueTarget(targets, targetPids, supplement));
        });
        this.dialogRef.close(targets);
      },
      error: () => {
        this.state = 'success';
      }
    });
  }

  isAllowed(): boolean {
    return this.selectedTargets.length > 0
      && (this.data.mode === 'import' || this.selectedTargets.every(target => this.isTargetAllowed(target)));
  }

  selectedTargetCountKey(): string {
    const count = this.selectedTargets.length;
    if (count === 0) {
      return '0';
    }
    if (count === 1) {
      return '1';
    }
    return count < 5 ? '4' : '5';
  }

  private isTargetAllowed(target: DocumentItem): boolean {
    const sourceModel = this.data.pages[0]?.model;
    return ModelTemplate.allowedChildrenForModel(this.config.models, target.model).includes(sourceModel)
      || (target.isMusicDocument() && (sourceModel === 'model:ndkaudiopage' || sourceModel === 'model:page'));
  }

  private toggleTarget(item: DocumentItem): void {
    const selected = this.selectedTargets.some(target => target.pid === item.pid);
    if (selected) {
      item.selected = false;
      this.selectedTargets = this.selectedTargets.filter(target => target.pid !== item.pid);
    } else {
      this.addTarget(item);
    }
  }

  private addTarget(item: DocumentItem): void {
    item.selected = true;
    if (!this.selectedTargets.some(target => target.pid === item.pid)) {
      this.selectedTargets = [...this.selectedTargets, item];
    }
  }

  removeTarget(target: DocumentItem): void {
    target.selected = false;
    this.selectedTargets = this.selectedTargets.filter(item => item.pid !== target.pid);
    const visibleItem = this.items.find(item => item.pid === target.pid);
    if (visibleItem) {
      visibleItem.selected = false;
    }
  }

  private addUniqueTarget(targets: DocumentItem[], targetPids: Set<string>, target: DocumentItem): void {
    if (!targetPids.has(target.pid)) {
      targets.push(target);
      targetPids.add(target.pid);
    }
  }

  private clearTargets(): void {
    this.selectedTargets.forEach(item => item.selected = false);
    this.items.forEach(item => item.selected = false);
    this.selectedTargets = [];
  }

  private showTree(item: DocumentItem): void {
    const previousRoot = this.selectedRootTreeItem();
    if (previousRoot) {
      previousRoot.expanded = false;
      previousRoot.childrenLoaded = false;
    }
    const root = item as TreeDocumentItem;
    root.level = 0;
    root.expandable = true;
    this.selectedRootTreeItem.set(root);
    this.expandedPath.set([item.pid]);
  }
}
