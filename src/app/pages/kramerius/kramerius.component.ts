import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { Mods } from 'src/app/model/mods.model';
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
  public instance: string
  public model: string;
  public dataTimestamp: number;
  // public metadata: Metadata;
  public xml: string;
  mods: Mods;
  state = 'none';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ui: UIService,
    public layout: LayoutService,
    private api: ApiService) { }

  ngOnInit(): void {
    this.layout.type = 'kramerius';
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        this.pid = p.get('pid');
        this.instance = q.get('instance');
        this.layout.krameriusInstance = this.instance;
        if (this.pid) {
          this.loadData();
        }
      });
  }

  private parseXml(mods: string) {
    const xml = mods.replace(/xmlns.*=".*"/g, '');
    const data = { explicitCharkey: true };
    const ctx = this;
    parseString(xml, data, function (err: any, result: any) {
      ctx.processPage(result);
      
    });
  }

  processPage(json: any) {
    console.log(json);
    this.layout.lastSelectedItem = new DocumentItem();
    const pageType = json['mods:mods']['mods:part'][0]['$']['type'];
    const detail: any[] = json['mods:mods']['mods:part'].map((d: any) => d['mods:detail']) ;
    console.log(detail)
    const pageNumber = detail.filter(d => d[0]['$']['type'] === 'pageNumber')[0][0]['mods:number'][0]._;
    const pageIndex = detail.filter(d => d[0]['$']['type'] === 'pageIndex')[0][0]['mods:number'][0]._;
    this.layout.lastSelectedItem.pid = this.pid;
    this.layout.lastSelectedItem.pageType = pageType;
    this.layout.lastSelectedItem.model = this.model;
    this.layout.lastSelectedItem.pageNumber = pageNumber;
    this.layout.lastSelectedItem.pageIndex = pageIndex;
    this.layout.lastSelectedItem.timestamp = this.dataTimestamp;
  }

  loadData() {
    this.state = 'loading';
    this.layout.lastSelectedItemMetadata = null;
    this.layout.lastSelectedItem = null;
    this.api.getKrameriusMods(this.pid, this.instance).subscribe((response: any) => {
      if (response && response['record']) {
        this.model = response['record'].model;
        this.dataTimestamp = response['record'].timestamp;
        
        if (this.isPage()) {
          this.mods = Mods.fromJson(response['record']);
          this.parseXml(response.record.content);
        } else {
          this.mods = Mods.fromJson(response['record']);
          this.layout.lastSelectedItemMetadata = new Metadata(this.pid, response['record']['model'], response['record']['content'], response['record']['timestamp']);
        }
        // this.parseXml(response.record.content);
        this.state = 'success';
      } else if (response && response['response'] && response['response'].errors) {
        console.log('error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        this.state = 'error';
      } else {
        this.state = 'success';
      }
      
    });
  }

  onDragEnd(columnindex: number, e: any) {
    
  }

  public isPage(): boolean {
    return this.model === 'model:page' || this.model === 'model:ndkpage' || this.model === 'model:oldprintpage';
  }

}
