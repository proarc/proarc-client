import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor-relocation',
  templateUrl: './editor-relocation.component.html',
  styleUrls: ['./editor-relocation.component.scss']
})
export class EditorRelocationComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];
  selection: DocumentItem;
  rootPid: string;
  parent: string;
  shortLabels = false;
  public relocationMode: boolean;

  @Input()
  set pid(pid: string) {
    this.parent = pid;
    this.rootPid = pid;
    this.goUp();
  }

  constructor(public layout: LayoutService,
    private ui: UIService,
    private router: Router,
    private dialog: MatDialog,
    private translator: TranslateService,
    private properties: LocalStorageService,
    private api: ApiService) {
  }

  ngOnInit() {
    this.shortLabels = this.properties.getBoolProperty('children.short_labels', false);
  }

  select(item: DocumentItem) {
    console.log(this.selection.parent, this.selection.pid);
  }

  isSelected(item: DocumentItem) {
    return item === this.selection;
  }

  canSave(): boolean {
    return !!this.selection;
  }

  onSave() {
    const checkbox = {
      label: String(this.translator.instant('editor.children.relocate_dialog.go')),
      checked: false
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('editor.children.relocate_dialog.title')),
      message: String(this.translator.instant('editor.children.relocate_dialog.message')),
      btn1: {
        label: String(this.translator.instant('common.yes')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('common.no')),
        value: 'no',
        color: 'default'
      },
      checkbox: checkbox
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {

        if (this.layout.getNumOfSelected() > 0 || this.layout.parent) {
          this.relocateObjects(this.layout.lastSelectedItem.parent, this.selection.pid, checkbox.checked);
        } else {
          this.setParent(this.selection.pid, checkbox.checked);
        }
      }
    });
  }

  setParent(destinationPid: string, openDestination: boolean) {
    this.state = 'saving';
    let pids: string[] = this.items.filter(c => c.selected).map(c => c.pid);
    this.api.setParent(this.layout.item.pid, destinationPid).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      } else {
        this.state = 'success';
        this.layout.setShouldRefresh(true);
      }
    });
  }

  onCancel() {
    this.setRelocationMode(false);
  }

  goUp() {
    this.state = 'loading';
    this.api.getParent(this.rootPid).subscribe((item: DocumentItem) => {
      if (item) {
        this.loadChildrenForPid(item.pid);
      } else {
        this.api.getDocument(this.rootPid).subscribe((root: DocumentItem) => {
          this.items = [];
          this.items.push(root);
          this.state = 'success';
        });
      }
    });
  }

  open(item: DocumentItem) {
    if (item.isPage()) {
      return;
    }
    this.loadChildrenForPid(item.pid);
  }

  private loadChildrenForPid(pid: string) {
    this.rootPid = pid;
    this.selection = null;
    this.state = 'loading';
    this.api.getRelations(pid).subscribe((children: DocumentItem[]) => {
      this.items = [];
      for (const child of children) {
        if (!child.isPage()) {
          this.items.push(child);
        }
      }
      this.state = 'success';
    });
  }

  relocateObjects(parentPid: string, destinationPid: string, openDestination: boolean) {
    this.state = 'saving';
    let pids: string[] = this.items.filter(c => c.selected).map(c => c.pid);
    const isMultiple = this.items.filter(c => c.selected).length > 1;

    this.api.relocateObjects(parentPid, destinationPid, pids).subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
        return;
      }
      if (!openDestination) {
        this.setRelocationMode(false);
        let nextSelection = 0;
        for (let i = this.items.length - 1; i >= 0; i--) {
          if (pids.indexOf(this.items[i].pid) > -1) {
            this.items.splice(i, 1);
            nextSelection = i - 1;
          }
        }
        if (nextSelection < 0) {
          nextSelection = 0;
        }
        if (this.items.length > 0 && !isMultiple) {
          this.layout.setSelection(false);
        }
        this.state = 'success';
        // this.goToObjectByPid(destinationPid);
      } else {
        this.goToObjectByPid(destinationPid);
      }
    });
  }


  public goToObjectByPid(pid: string) {
    if (pid) {
      this.router.navigate(['/repository', pid]);
    }
  }

  setRelocationMode(enabled: boolean) {
    this.relocationMode = enabled;
  }

  switchRelocationMode() {
    this.setRelocationMode(!this.relocationMode);
  }


}
