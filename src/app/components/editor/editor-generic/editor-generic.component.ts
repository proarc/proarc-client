import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { ILayoutPanel } from 'src/app/pages/layout-admin/layout-admin.component';
import { ConfigService } from 'src/app/services/config.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-generic',
  templateUrl: './editor-generic.component.html',
  styleUrls: ['./editor-generic.component.scss']
})
export class EditorGenericComponent implements OnInit {

  @Input('editorType') editorType: string;
  @Input('panel') panel: ILayoutPanel;

  switchableTypes = ['mods', 'metadata', 'atm', 'ocr']
  switchable: boolean;


  constructor(
    public config: ConfigService,
    public layout: LayoutService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  ngOnChanges(c: SimpleChange) {
    this.switchable = this.switchableTypes.includes(this.editorType);
      
  }


  countPlurals(): string {
    let count = this.layout.getNumOfSelected();
      if (count > 4) {
        return '5'
      } else if (count > 1) {
        return '4'
      } else {
        return count + '';
      }
    }
}
