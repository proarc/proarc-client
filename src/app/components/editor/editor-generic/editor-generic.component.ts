import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Tree } from 'src/app/model/mods/tree.model';
import { ILayoutPanel } from 'src/app/dialogs/layout-admin/layout-admin.component';
import { ConfigService } from 'src/app/services/config.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor-generic',
  templateUrl: './editor-generic.component.html',
  styleUrls: ['./editor-generic.component.scss']
})
export class EditorGenericComponent implements OnInit {

  @Input('editorType') editorType: string;
  @Input('panel') panel: ILayoutPanel;
  @Output() onIngest = new EventEmitter<boolean>();


  subscriptions: Subscription[] = [];
  itemModel: string;
  numOfSelected: number;
  showPagesEditor: boolean;

  showAudioPagesEditor: boolean;
  
  constructor(
    public config: ConfigService,
    public layout: LayoutService,
    private ui: UIService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      this.numOfSelected = this.layout.getNumOfSelected();
      this.showPagesEditor = this.layout.showPagesEditor();
      this.showAudioPagesEditor = this.layout.showAudioPagesEditor();
      this.itemModel = this.itemType();
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

  changeEditorType(newType: string) {
    this.editorType = newType;
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

  passOnIngest() {
    this.onIngest.emit(true);
  }
}
