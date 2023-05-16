import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { LayoutService } from 'src/app/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-editor-switcher',
  templateUrl: './editor-switcher.component.html',
  styleUrls: ['./editor-switcher.component.scss']
})
export class EditorSwitcherComponent {

  @Input('editorType') editorType: string;
  @Output() onChangeEditorType = new EventEmitter<string>();

  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog) {
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

  changeEditorType(t: string) {
    this.onChangeEditorType.emit(t);
  }

}
