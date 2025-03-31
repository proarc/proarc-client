import { Component, computed, input, output } from '@angular/core';
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

@Component({
  selector: 'app-panel',
    imports: [CommonModule, TranslateModule, FlexLayoutModule, EditorModsComponent, EditorStructureComponent, EditorOcrComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  
  panel  = input<ILayoutPanel>();
  panelType: string;
  onIngest = output<boolean>();

  itemModel = input<string>();
  numOfSelected = input<number>();
  showPagesEditor = input<boolean>();
  showAudioPagesEditor = input<boolean>();

  lastSelectedItem = input<DocumentItem>();

  subscriptions: Subscription[] = [];


  formHighlighting: boolean;
  
  constructor(
    public config: Configuration,
    private ui: UIService) { }

  ngOnInit(): void {
    this.panelType = this.panel().type;
    this.formHighlighting = localStorage.getItem('formHighlighting') === 'true';
    
  }

  changePanelType(newType: string) {
    this.panelType = newType;
  }

  passOnIngest() {
    this.onIngest.emit(true);
  }
}
