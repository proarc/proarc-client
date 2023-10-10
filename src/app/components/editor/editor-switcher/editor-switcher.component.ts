import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { LayoutService } from 'src/app/services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-editor-switcher',
  templateUrl: './editor-switcher.component.html',
  styleUrls: ['./editor-switcher.component.scss']
})
export class EditorSwitcherComponent {

  @Input('editorType') editorType: string;
  @Output() onChangeEditorType = new EventEmitter<string>();

  subscriptions: Subscription[] = [];

  plurals: string;
  model: string;
  numOfSelected: number;

  constructor(
    private translator: TranslateService,
    public layout: LayoutService,
    private ui: UIService,
    private api: ApiService,
    private dialog: MatDialog) {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      this.plurals = this.countPlurals();
      this.model = this.itemType();
    }));
  }

  itemType(): string {
    if (this.layout.lastSelectedItem.isPage()) {
      return 'page';
    }
    if (this.layout.lastSelectedItem.isAudioPage()) {
      return 'song';
    }
    if (this.layout.lastSelectedItem.isAudioPage()) {
      return 'song';
    }
    return null;
  }

  countPlurals(): string {
    this.numOfSelected = this.layout.getNumOfSelected();
    if (this.numOfSelected > 4) {
      return '5'
    } else if (this.numOfSelected > 1) {
      return '4'
    } else {
      return this.numOfSelected + '';
    }
  }

  changeEditorType(t: string) {
    this.onChangeEditorType.emit(t);
  }

}
