import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { EditorService } from 'src/app/services/editor.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';

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

  @Input()
  set pid(pid: string) {
    this.parent = pid;
    this.rootPid = pid;
    this.goUp();
  }

  constructor(public editor: EditorService,
              private dialog: MatDialog,
              private api: ApiService) {
  }

  ngOnInit() {

  }

  select(item: DocumentItem) {
    this.selection = item;
  }

  isSelected(item: DocumentItem) {
    return item === this.selection;
  }

  canSave(): boolean {
    return !!this.selection;
  }

  onSave() {
    console.log('selection', this.selection);



    const checkbox = {
      label: 'Přejít na nově zvolený objekt',
      checked: false
    };
    const data: SimpleDialogData = {
      title: 'Přesun objektů',
      message: 'Opravdu chcete přesunou vybrané objekty do nově zvoleného objektu?',
      btn1: {
        label: 'Ano',
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      checkbox: checkbox
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.editor.relocateObjects(this.selection, checkbox.checked);
      }
    });
  }

  onCancel() {
    this.editor.setRelocationMode(false);
  }

 goUp() {
    this.state = 'loading';
    console.log('go up for', this.pid);

    this.api.getParent(this.rootPid).subscribe((item: DocumentItem) => {
      console.log('parent', item);
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
