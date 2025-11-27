import { Component, computed, effect, input, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';

import { TranslateModule } from '@ngx-translate/core';
import { DocumentItem } from '../../model/documentItem.model';
import { EditorModsComponent } from "../../editors/editor-mods/editor-mods.component";
import { EditorStructureComponent } from "../../editors/editor-structure/editor-structure.component";
import { EditorOcrComponent } from "../../editors/editor-ocr/editor-ocr.component";
import { MediaComponent } from "../media/media.component";
import { ViewerComponent } from "../viewer/viewer.component";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EditorCommentComponent } from "../../editors/editor-comment/editor-comment.component";
import { EditorAtmComponent } from "../../editors/editor-atm/editor-atm.component";
import { EditorPageComponent } from "../../editors/editor-page/editor-page.component";
import { EditorPagesComponent } from "../../editors/editor-pages/editor-pages.component";
import { EditorAudioPagesComponent } from "../../editors/editor-audioPages/editor-audioPages.component";
import { EditorAudioPageComponent } from "../../editors/editor-audioPage/editor-audioPage.component";
import { EditorTreeComponent } from "../../editors/editor-tree/editor-tree.component";
import { EditorMetadataComponent } from "../../editors/editor-metadata/editor-metadata.component";
import { SongComponent } from "../song/song.component";
import { UserSettings } from '../../shared/user-settings';

@Component({
  selector: 'app-panel',
    imports: [TranslateModule, EditorModsComponent, EditorStructureComponent, EditorOcrComponent, MediaComponent, ViewerComponent, MatCardModule, MatIconModule, EditorCommentComponent, EditorAtmComponent, EditorPageComponent, EditorPagesComponent, EditorAudioPagesComponent, EditorAudioPageComponent, EditorTreeComponent, EditorMetadataComponent, SongComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  
  panel  = input<ILayoutPanel>();
  panelType: string;
  onIngest = output<boolean>();

  itemModel: string;
  numOfSelected = input<number>();
  showPagesEditor: boolean;
  showAudioPagesEditor: boolean;

  lastSelectedItem = input<DocumentItem>();
  rootItem = input<DocumentItem>();
  imageInfo: { pid: string, dsid: string, width?: number, height?: number };
  

  subscriptions: Subscription[] = [];

  formHighlighting: boolean;
  
  constructor(
    public config: Configuration,
    public settings: UserSettings,
    private ui: UIService) { 
      effect(() => {
        const lastSelectedItem = this.lastSelectedItem();
        if (!lastSelectedItem) {
          return;
        }
        this.itemModel = this.itemType(lastSelectedItem);
        this.imageInfo = {pid: lastSelectedItem.pid, dsid: 'FULL'};
        this.showPagesEditor = this.isPagesEditor(this.numOfSelected(), lastSelectedItem);
        this.showAudioPagesEditor = this.isAudioPagesEditor(this.numOfSelected(), lastSelectedItem);
      })
    }

  ngOnInit(): void {
    this.panelType = this.panel().type;
    this.formHighlighting = this.settings.formHighlighting;
    
  }

  public isPagesEditor(numOfSelected: number, lastSelectedItem: DocumentItem): boolean {
    return numOfSelected > 1 && lastSelectedItem.isPage();
  }

  public isAudioPagesEditor(numOfSelected: number, lastSelectedItem: DocumentItem): boolean {
    return numOfSelected > 1 && lastSelectedItem.isAudioPage();
    // if (this.getNumOfSelected() < 2) {
    //   return false;
    // }
    // let count = 0;
    // for (const child of this.items) {
    //   if (child.selected) {
    //     count += 1;
    //     if (!child.isAudioPage()) {
    //       return false;
    //     }
    //   }
    // }
    // return count > 0;
  }

  changePanelType(newType: string) {
    this.panelType = newType;
  }

  passOnIngest() {
    this.onIngest.emit(true);
  }

  itemType(lastSelectedItem: DocumentItem): string {
    if (!lastSelectedItem) {
      return null;
    }
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

}
