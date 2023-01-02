import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';
import { UIService } from 'src/app/services/ui.service';
import { parseString, processors } from 'xml2js';

@Component({
  selector: 'app-editor-premis',
  templateUrl: './editor-premis.component.html',
  styleUrls: ['./editor-premis.component.scss']
})
export class EditorPremisComponent implements OnInit {

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(
    public layout: LayoutService,
    private api: ApiService,
    private ui: UIService,) { }

  ngOnInit(): void {
  }

  onPidChanged(pid: string) {
    this.loadData(pid)
  }

  loadData(pid: string) {
    this.api.getPremis(pid).subscribe((resp: any) => {
      this.parseXml(resp.record.content)
    });
  }

  private parseXml(mods: string) {
    const xml = mods.replace(/xmlns.*=".*"/g, '');
    const data = {tagNameProcessors: [processors.stripPrefix], explicitCharkey: true};
    const ctx = this;
    parseString(xml, data, function (err: any, result: any) {
        // ctx.processMods(result);
        console.log(result)
    });
  }

}
