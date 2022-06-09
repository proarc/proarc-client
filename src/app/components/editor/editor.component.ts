import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { EditorService } from 'src/app/services/editor.service';
import { ConfigService } from 'src/app/services/config.service';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
    private properties: LocalStorageService
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
  

}
