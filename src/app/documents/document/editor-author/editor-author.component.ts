import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { Translator } from 'angular-translator';
import { HelpService } from 'src/app/services/help.service';
import { MatDialog } from '@angular/material';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import { Metadata } from 'src/app/model/metadata.model';
import { ModsAuthor } from 'src/app/model/mods/author.model';

@Component({
  selector: 'app-editor-author',
  templateUrl: './editor-author.component.html',
  styleUrls: ['./editor-author.component.scss']
})
export class EditorAuthorComponent implements OnInit {
  @Input() field: ElementField;

  private nameTypeCodes: string[] = ['', 'personal', 'corporate', 'conference', 'family'];
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

  public roles = [];
  public nameTypes = [];

  constructor(public translator: Translator, private dialog: MatDialog, public help: HelpService) {
    this.translateCodes();
    translator.languageChanged.subscribe(() => this.translateCodes());
  }

  ngOnInit() {
  }


  onLoadFromCatalog(item) {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'authors' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        const mods = result['mods'];
        console.log('mods', mods);
        const metadata = new Metadata('', '', mods, 0);
        const nameField = metadata.getField(ModsAuthor.getSelector());
        const items = nameField.getItems();
        if (nameField && items.length > 0) {
          this.field.addAfterItem(item, items[0]);
          this.field.removeItem(item);
        }
      }
    });
  }

  translateCodes() {
    this.translator.waitForTranslation().then(() => {
      this.nameTypes = [];
      for (const code of this.nameTypeCodes) {
        if (code === '') {
          this.nameTypes.push({ code: '', name: '-' });
        } else {
        this.nameTypes.push({ code: code, name: this.translator.instant('name.' + code)});
        }
      }
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
    });
  }

}
