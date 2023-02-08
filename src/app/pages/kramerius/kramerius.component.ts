import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { Mods } from 'src/app/model/mods.model';
import { Page } from 'src/app/model/page.model';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { parseString } from 'xml2js';

@Component({
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

  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ui: UIService,
    public layout: LayoutService,
    private api: ApiService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.layout.type = 'kramerius';

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

  loadData() {
    this.state = 'loading';
    this.hasImage = false;
    this.layout.lastSelectedItemMetadata = null;
    this.layout.lastSelectedItem = null;
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
        this.layout.lastSelectedItemMetadata = new Metadata(this.pid, response['record']['model'], response['record']['content'], response['record']['timestamp']);
        this.state = 'success';
      } else if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
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
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
      } else if (response && response['response'] && response['response']['data']) {
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
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
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
