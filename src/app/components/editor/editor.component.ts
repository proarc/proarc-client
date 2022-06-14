import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { EditorService } from 'src/app/services/editor.service';
import { ConfigService } from 'src/app/services/config.service';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('split') split: SplitComponent;
  @ViewChild('area1') area1: SplitAreaDirective;
  @ViewChild('area2') area2: SplitAreaDirective;
  @ViewChild('area3') area3: SplitAreaDirective;
  
  twoSplitWidths: string[];
  threeSplitWidths: string[];


  
  constructor(
    private route: ActivatedRoute,
    public editor: EditorService,
    public config: ConfigService,
    private properties: LocalStorageService,
    private dialog: MatDialog
    ) { }


  ngOnInit() {
    this.twoSplitWidths = [
      this.properties.getStringProperty('editor.split.two.0', "50"),
      this.properties.getStringProperty('editor.split.two.1', "50"),
      this.properties.getStringProperty('editor.split.two.2', "0")
    ];
    this.threeSplitWidths = [
      this.properties.getStringProperty('editor.split.three.0', "33"),
      this.properties.getStringProperty('editor.split.three.1', "34"),
      this.properties.getStringProperty('editor.split.three.2', "33")
    ];
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        const pid = p.get('pid');
        const batchId = p.get('batch_id');
        if (pid) {
          this.editor.init({
            pid: pid,
            preparation: false
          });
        } else if (batchId) {
          this.editor.init({
            pid: batchId,
            preparation: true
          });
        }
    });

  }

  getSplitSize(split: number): number {
    if (this.editor.doubleRight) {
      return parseInt(this.threeSplitWidths[split]);
    }
    return parseInt(this.twoSplitWidths[split]);
  }

  dragEnd(sizes: any) {
    if (this.editor.doubleRight) {
      this.threeSplitWidths[0] = sizes[0];
      this.threeSplitWidths[1] = sizes[1];
      this.threeSplitWidths[2] = sizes[2];
      this.properties.setStringProperty('editor.split.three.0', String(sizes[0]));
      this.properties.setStringProperty('editor.split.three.1', String(sizes[1]));
      this.properties.setStringProperty('editor.split.three.2', String(sizes[2]));
    } else {
      this.twoSplitWidths[0] = sizes[0];
      this.twoSplitWidths[1] = sizes[1];
      this.twoSplitWidths[2] = sizes[2];
      this.properties.setStringProperty('editor.split.two.0', String(sizes[0]));
      this.properties.setStringProperty('editor.split.two.1', String(sizes[1]));
      this.properties.setStringProperty('editor.split.two.2', String(sizes[2]));
    }
  }

  dblClick() {
    this.twoSplitWidths = ["50", "50", '0'];
  }

  countPlurals(): string {
  let count = this.editor.numberOfSelectedChildren();
    if (count > 4) {
      return '5'
    } else if (count > 1) {
      return '4'
    } else {
      return count + '';
    }
  }

  confirmLeaveDialog() {
    const data: SimpleDialogData = {
      title: 'Upozorneni',
      message:'Opouštíte formulář bez uložení. Opravdu chcete pokracovat?',
      btn1: {
        label: "Ano",
        value: 'true',
        color: 'warn'
      },
      btn2: {
        label: "Ne",
        value: 'false',
        color: 'default'
      },
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    return dialogRef.afterClosed();
  }
  
  hasPendingChanges(): boolean {
    if (this.editor.showPagesEditor()) {
      return this.editor.isDirty;
    } else if (this.editor.mode == 'children') {
      return this.editor.isLeftDirty;
    } else if (this.editor.metadata && (!this.editor.left.isPage() && !this.editor.left.isChronicle()) || this.editor.rightEditorType === 'metadata') {
      return this.editor.metadata.hasChanges();
    }
    return false;
  }
}
