import { Component, computed, effect, input, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
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

@Component({
  selector: 'app-panel',
    imports: [CommonModule, TranslateModule, FlexLayoutModule,
    EditorModsComponent, EditorStructureComponent, EditorOcrComponent, MediaComponent, ViewerComponent,
    MatCardModule, MatIconModule, EditorCommentComponent, EditorAtmComponent, EditorPageComponent, EditorPagesComponent, EditorAudioPagesComponent, EditorAudioPageComponent],
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
  imageInfo: { pid: string, dsid: string, width?: number, height?: number };
  

  subscriptions: Subscription[] = [];

  formHighlighting: boolean;
  
  constructor(
    public config: Configuration,
    private ui: UIService) { 
      effect(() => {
        const lastSelectedItem = this.lastSelectedItem();
        this.itemModel = this.itemType(lastSelectedItem);
        this.imageInfo = {pid: lastSelectedItem.pid, dsid: 'FULL'};
        this.showPagesEditor = this.isPagesEditor(lastSelectedItem);
        this.showAudioPagesEditor = false;
      })
    }

  ngOnInit(): void {
    this.panelType = this.panel().type;
    this.formHighlighting = localStorage.getItem('formHighlighting') === 'true';
    
  }

  public isPagesEditor(lastSelectedItem: DocumentItem): boolean {
    return this.numOfSelected() > 1 && lastSelectedItem.isPage();
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
