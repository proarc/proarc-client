import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import {CodebookService} from '../../../services/codebook.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor-relatedItem',
  templateUrl: './editor-relatedItem.component.html',
  styleUrls: ['./editor-relatedItem.component.scss']
})
export class EditorRelatedItemComponent implements OnInit {

  validityOptions = [{code: '', name: 'Platný' }, {code: 'yes', name: 'Neplatný'}];

  private roleCodes = ['act', 'adp', 'aft', 'ann', 'ant', 'app', 'aqt', 'arc', 'arr', 'art', 'asg', 'asn', 'att', 'auc', 'aud',
    'aui', 'aus', 'aut', 'bdd', 'bjd', 'bkd', 'bkp', 'bnd', 'bpd', 'bsl', 'ccp', 'chr', 'cli', 'cll', 'clt', 'cmm', 'cmp', 'cmt',
    'cnd', 'cns', 'coe', 'col', 'com', 'cos', 'cot', 'cov', 'cpc', 'cpe', 'cph', 'cpl', 'cpt', 'cre', 'crp', 'crr', 'csl',
    'csp', 'cst', 'ctb', 'cte', 'ctg', 'ctr', 'cts', 'ctt', 'cur', 'cwt', 'dfd', 'dfe', 'dft', 'dgg', 'dis', 'dln', 'dnc',
    'dnr', 'dpc', 'dpt', 'drm', 'drt', 'dsr', 'dst', 'dte', 'dto', 'dub', 'edt', 'egr', 'elt', 'eng', 'etr', 'exp', 'fac',
    'flm', 'fmo', 'fnd', 'frg', 'grt', 'hnr', 'hst', 'ill', 'ilu', 'ins', 'inv', 'itr', 'ive', 'ivr', 'lbt', 'lee', 'lel',
    'len', 'let', 'lie', 'lil', 'lit', 'lsa', 'lse', 'lso', 'ltg', 'lyr', 'mdc', 'mod', 'mon', 'mrk', 'mte', 'mus', 'nrt',
    'opn', 'org', 'orm', 'oth', 'own', 'pat', 'pbd', 'pbl', 'pfr', 'pht', 'plt', 'pop', 'ppm', 'prc', 'prd', 'prf', 'prg',
    'prm', 'pro', 'prt', 'pta', 'pte', 'ptf', 'pth', 'ptt', 'rbr', 'rce', 'rcp', 'red', 'ren', 'res', 'rev', 'rpt', 'rpy',
    'rse', 'rsp', 'rst', 'rth', 'rtm', 'sad', 'sce', 'scr', 'scl', 'sec', 'sgn', 'sng', 'spk', 'spn', 'srv', 'stn', 'stl',
    'str', 'ths', 'trc', 'trl', 'tyd', 'tyg', 'voc', 'wam', 'wdc', 'wde', 'wit'];

  public roles: { code: string; name: any; }[] = [];

  @Input() field: ElementField;
  @Input() model: string;

  constructor(public translator: TranslateService, public codebook: CodebookService) {
    this.translateCodes();
    translator.onLangChange.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
    if (this.field) {
      this.field.getItems()[0].getControl('roles')
    }
    
  }

  translateCodes() {
    // this.translator.waitForTranslation().then(() => {
      this.roles = [];
      for (const code of this.roleCodes) {
        this.roles.push({code: code, name: this.translator.instant('role.' + code)});
      }
      this.roles.sort((a: any, b: any): number => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    // });
  }

  getIdentifiers(): any[] {  
    return this.codebook.getIdentifiers(this.model);
    // return this.layout.selectedItem.isChronicle() ? this.codebook.chronicleIdentifiers :
    //   this.layout.selectedItem.isOldprint() ? this.codebook.oldprintIdentifiers :
    //   this.layout.selectedItem.canContainPdf() ? this.codebook.eDocumentIdentifiers :
    //     this.codebook.identifiers;
  }
}
