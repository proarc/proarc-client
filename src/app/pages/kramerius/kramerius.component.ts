import {Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { combineLatest, Subscription } from 'rxjs';
import { parseString } from 'xml2js';
import { PanelComponent } from '../../components/panel/panel.component';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { Metadata } from '../../model/metadata.model';
import { Mods } from '../../model/mods.model';
import { Page } from '../../model/page.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { TemplateService } from '../../services/template.service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';
import { MatSelectModule } from "@angular/material/select";
import { EditorPageComponent } from "../../editors/editor-page/editor-page.component";
import { EditorMetadataComponent } from "../../editors/editor-metadata/editor-metadata.component";
import { KrameriusModsComponent } from "./kramerius-mods/kramerius-mods.component";
import { ViewerComponent } from "../../components/viewer/viewer.component";

@Component({
  imports: [TranslateModule, FormsModule, AngularSplitModule, RouterModule,
    MatIconModule, MatButtonModule, MatProgressBarModule, MatCardModule,
    MatTooltipModule, MatMenuModule, MatSelectModule, EditorPageComponent, EditorMetadataComponent,
    KrameriusModsComponent, ViewerComponent],
  selector: 'app-kramerius',
  templateUrl: './kramerius.component.html',
  styleUrls: ['./kramerius.component.scss']
})
export class KrameriusComponent implements OnInit {

  public pid: string;
  public instance: string;
  public importInstance: string;
  public instances: { krameriusInstanceId: string, krameriusInstanceName: string }[];
  public model: string;
  public hasImage = false;
  // public metadata: Metadata;
  public xml: string;
  mods: Mods;
  state = 'none';
  panel: ILayoutPanel = {
    id: 'kramerius',
    visible: true,
    size: 0,
    type: 'a',
    isDirty: false,
    canEdit: true
  };

  panelType: string;

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ui: UIService,
    public layout: LayoutService,
    private tmpl: TemplateService,
        public settings: UserSettings,
    private api: ApiService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.layout.type = 'kramerius';
    this.panelType = this.panel.type;;

    this.subscriptions.push(this.layout.shouldRefresh().subscribe((keepSelection: boolean) => {
      this.loadData();
    }));

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.pid = p.get('pid');
        this.instance = q.get('instance');
        this.importInstance = this.instance;
        this.layout.krameriusInstance = this.instance;
        if (this.pid) {
          this.loadData();
        }
      });
  }

  changePanelType(newType: string) {
    this.panelType = newType;
  }

  loadData() {
    this.state = 'loading';
    this.hasImage = false;
    this.layout.lastSelectedItemMetadata = null;
    this.layout.lastSelectedItem.set(null);
    this.api.getKrameriusMods(this.pid, this.instance).subscribe((response: any) => {
      if (response && response['response'] && response['response']['data']) {
        // stranka
        this.model = response['response']['data'][0].model;
        this.layout.krameriusPage = Page.fromJson(response['response']['data'][0], this.model);
        this.mods = Mods.fromJson(response['response']['data'][0]);
        this.hasImage = true;
        this.state = 'success';
      } else if (response && response['record']) {
        this.hasImage = false;
        this.model = response['record'].model;
        this.mods = Mods.fromJson(response['record']);

        const standard = response['record']['standard'] ? response['record']['standard'] : Metadata.resolveStandardFromXml(response['record']['content']);
        this.tmpl.getTemplate(standard, this.model).subscribe((tmpl: any) => {
          this.layout.lastSelectedItemMetadata = new Metadata(this.pid, this.model, response['record']['content'], response['record']['timestamp'], standard, tmpl, this.settings);
        });

        //this.layout.lastSelectedItemMetadata = new Metadata(this.pid, response['record']['model'], response['record']['content'], response['record']['timestamp'], response['record']['standard']);

        this.state = 'success';
      } else if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
      } else {
        this.state = 'success';
      }
    });

    this.api.getKrameriusInstances().subscribe((resp: any) => {
      this.instances = resp.response.data;
    });

    // this.api.getKrameriusImage(this.pid, this.instance).subscribe((resp: any) => {
    //   console.log(resp)
    //   this.hasImage = resp.response.status !== 404;
    //   this.hasImage = true;
    // });
  }

  onDragEnd(columnindex: number, e: any) {

  }

  public isPage(): boolean {
    return this.model === 'model:page' || this.model === 'model:ndkpage' || this.model === 'model:oldprintpage';
  }

  importToKramerius() {

    this.api.importToKramerius(this.pid, this.instance, this.importInstance).subscribe((response: any) => {
      if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
      } else if (response && response['response'] && response['response']['status'] === -1) {
          this.ui.showErrorSnackBar(response['response']['data'], 2000);
      }  else if (response && response['response'] && response['response']['data']) {
        if (response['response']['data'][0].status === 'Failed') {
          this.ui.showErrorSnackBar(response['response']['data'][0].reason, 2000);
        } else {
          this.ui.showInfoSnackBar(response['response']['data'][0].reason, 2000);
        }
      } else {
        this.state = 'success';
      }
    });

  }

  importToProArc() {
    this.api.importToProArc(this.pid, this.instance).subscribe((response: any) => {
      if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorDialogFromObject(response['response'].errors);
        this.state = 'error';
      } else if (response && response['response'] && response['response']['data']) {
        if (response['response']['data'][0].status === 'Failed') {
          this.ui.showErrorSnackBar(response['response']['data'][0].reason, 2000);
        } else {
          this.ui.showInfoSnackBar('Import proběhl v pořádku', 2000);
        }
      } else {
        this.state = 'success';
      }
    });

  }

}
