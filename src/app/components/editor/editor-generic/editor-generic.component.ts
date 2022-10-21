import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { ILayoutPanel } from 'src/app/pages/layout-admin/layout-admin.component';
import { ConfigService } from 'src/app/services/config.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Subscription } from 'rxjs';

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

  sc: Subscription;

  constructor(
    public config: ConfigService,
    public layout: LayoutService) { }

  ngOnInit(): void {
    // this.sc = this.layout.selectionChanged().subscribe(() => {
    //   console.log(this.editorType);
    //   this.setVisibility();
    // });
    // this.setVisibility();
  }

  ngOnDestroy() {
    //this.sc.unsubscribe();
  }

  ngOnChanges(c: SimpleChange) {
    this.switchable = this.switchableTypes.includes(this.editorType);
      
  }

  setVisibility() {
    console.log(this.editorType);
    if (this.editorType === 'image') {
      this.panel.isEmpty = !(this.layout.selectedItem && this.layout.selectedItem.isPage());
      console.log(this.panel.isEmpty);
    }
  }


}
