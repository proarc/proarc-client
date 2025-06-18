import { Component, effect, input, output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../../services/layout-service';
import { DocumentItem } from '../../model/documentItem.model';


@Component({
  imports: [TranslateModule, FormsModule, MatIconModule, MatTooltipModule, MatButtonModule],
  selector: 'app-editor-switcher',
  templateUrl: './editor-switcher.component.html',
  styleUrls: ['./editor-switcher.component.scss']
})
export class EditorSwitcherComponent {

  panelType = input<string>();
  onChangeEditorType = output<string>();

  subscriptions: Subscription[] = [];

  plurals: string;
  model: string;
  numOfSelected: number;

  constructor(
    public layout: LayoutService) {
      effect(() => {
        const lastSelectedItem = this.layout.lastSelectedItem();
        this.plurals = this.countPlurals();
        this.model = this.itemType(lastSelectedItem);
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
  }

  itemType(lastSelectedItem: DocumentItem): string {
    if (lastSelectedItem.isPage()) {
      return 'page';
    }
    if (lastSelectedItem.isAudioPage()) {
      return 'song';
    }
    if (lastSelectedItem.isAudioPage()) {
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
