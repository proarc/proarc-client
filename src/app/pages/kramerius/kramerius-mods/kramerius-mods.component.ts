import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { Mods } from '../../../model/mods.model';
import { ApiService } from '../../../services/api.service';
import { LayoutService } from '../../../services/layout-service';
import { UIService } from '../../../services/ui.service';
import { HighlightAuto } from 'ngx-highlightjs';

@Component({
  imports: [TranslateModule, FormsModule, AngularSplitModule, RouterModule, HighlightAuto,
    MatIconModule, MatButtonModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatMenuModule, MatSelectModule],
  selector: 'app-kramerius-mods',
  templateUrl: './kramerius-mods.component.html',
  styleUrls: ['./kramerius-mods.component.scss']
})
export class KrameriusModsComponent implements OnInit {

  @Input() mods: Mods;
  @Input() pid: string;
  @Input() instance: string;

  @ViewChild('editingPre') editingPre: ElementRef;
  @ViewChild('originalPre') originalPre: ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  anyChange: boolean;
  lastPid: string;

  originalText = '';

  constructor(private api: ApiService, private ui: UIService, private layout: LayoutService) { }

  ngOnInit(): void {
  }

  public setRealtime(enable: boolean) {
    if (enable) {
      this.onClear();
    } else {
      // this.loadPremis();
    }
    this.realtime = enable;
  }

  onEdit() {
    if (this.realtime) {
      return;
    }
    this.originalText = this.originalPre.nativeElement.innerText;
    this.editting = true;
  }

  onClear() {
    if (this.realtime) {
      return;
    }
    this.editting = false;
    this.anyChange = false;
    this.mods.restore();
  }

  onRefresh() {
    if (this.editting || this.realtime) {
      return;
    }
    // this.loadPremis();
  }

  checkChanged() {
    this.anyChange = this.editingPre.nativeElement.innerText !== this.originalText;
  }

  onSave() {
    this.mods.content = this.editingPre.nativeElement.innerText;
    this.api.saveKrameriusMods(this.pid, this.instance, this.mods.content, this.mods.timestamp).subscribe((response: any) => {
      if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
      } else {
        this.layout.setShouldRefresh(false);
        this.state = 'success';
      }
    });
  }

}
