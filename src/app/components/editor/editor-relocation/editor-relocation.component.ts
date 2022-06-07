import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { EditorService } from 'src/app/services/editor.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { Translator } from 'angular-translator';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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

  @Input()
  set pid(pid: string) {
    this.parent = pid;
    this.rootPid = pid;
    this.goUp();
  }

  constructor(public editor: EditorService,
              private dialog: MatDialog,
              private translator: Translator,
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

        if (this.editor.numberOfSelectedChildren() > 0 || this.editor.parent) {
          const items = this.editor.numberOfSelectedChildren() > 0 ? this.editor.getSelectedChildren() : [this.editor.left];
          this.editor.relocateObjects(items[0].parent, this.selection.pid, checkbox.checked);
        } else {
          this.editor.setParent(this.selection.pid, checkbox.checked);
        }
        // const items = selected.length > 0 ? selected : [this.editor.left];
        // const parent = selected.length > 0 ? this.editor.left : this.editor.parent;
        // this.editor.relocateObjects(this.selection.parent, this.selection.pid, checkbox.checked);
      }
    });
  }

  onCancel() {
    this.editor.setRelocationMode(false);
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




}
