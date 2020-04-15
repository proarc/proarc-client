import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-chronicle-language',
  templateUrl: './editor-chronicle-language.component.html',
  styleUrls: ['./editor-chronicle-language.component.scss']
})
export class EditorChronicleLanguageComponent implements OnInit {

  langs: any[] = [];

  // languages = [
  //     'aar', 'abk', 'ave', 'afr', 'aka', 'amh', 'arg', 'ara', 'asm', 'ava', 'aym', 'aze', 'bak', 'bel', 'bul', 'bih',
  //     'bis', 'bam', 'ben', 'tib', 'bre', 'bos', 'cat', 'che', 'cha', 'cos', 'cre', 'cze', 'chu', 'chv',
  //     'wel', 'dan', 'ger', 'div', 'dzo', 'ewe', 'gre', 'eng', 'epo', 'spa', 'est', 'baq',
  //     'per', 'ful', 'fin', 'fij', 'fao', 'fre', 'fry', 'gle', 'gla', 'glg', 'grn', 'guj', 'glv', 'hau',
  //     'heb', 'hin', 'hmo', 'hrv', 'hat', 'hun', 'arm', 'her', 'ina', 'ind', 'ile', 'ibo', 'iii', 'ipk',
  //     'ido', 'ice', 'ita', 'iku', 'jpn', 'jav', 'geo', 'kon', 'kik', 'kua', 'kaz', 'kal', 'khm', 'kan',
  //     'kor', 'kau', 'kas', 'kur', 'kom', 'cor', 'kir', 'lat', 'ltz', 'lug', 'lim', 'lin', 'lao', 'lit', 'lub', 'lav',
  //     'mlg', 'mah', 'mao', 'mac', 'mal', 'mon', 'mar', 'may', 'mlt', 'bur', 'nau',
  //     'nob', 'nde', 'nep', 'ndo', 'dut', 'nno', 'nor', 'nbl', 'nav', 'nya', 'oci', 'oji', 'orm', 'ori', 'oss',
  //     'pan', 'pli', 'pol', 'pus', 'por', 'que', 'roh', 'run', 'rum', 'rus', 'kin', 'san', 'srd', 'snd', 'sme',
  //     'sag', 'sin', 'slo', 'slv', 'smo', 'sna', 'som', 'alb', 'srp', 'ssw', 'sot', 'sun', 'swe',
  //     'swa', 'tam', 'tel', 'tgk', 'tha', 'tir', 'tuk', 'tgl', 'tsn', 'ton', 'tur', 'tso', 'tat', 'twi', 'tah', 'uig',
  //     'ukr', 'urd', 'uzb', 'ven', 'vie', 'vol', 'wln', 'wol', 'xho', 'yid', 'yor', 'zha', 'chi', 'zul', 'grc',
  //     'zxx', 'tai', 'und', 'sla', 'mul', 'inc', 'akk', 'arc', 'rom', 'egy', 'wen', 'egy', 'sux', 'frm', 'syr', 'fro',
  //     'cop', 'mis', 'ine', 'dum', 'hit', 'ira', 'haw'
  // ];

  otherLanguages = ['eng', 'fre',  'heb',  'ita', 'pol',  'por', 'rus',  'gre',  'slo',  'grc',  'spa',  'mul',  'zxx'];

  @Input() field: ElementField;

  constructor(public translator: Translator) {
    this.translateLanguages();
    translator.languageChanged.subscribe(() => this.translateLanguages());
  }

  translateLanguages() {
    this.translator.waitForTranslation().then(() => {
      this.langs = [];
      const otherLangs = [];
      this.langs.push({code: 'cze', name: this.translator.instant('lang.cze')});
      this.langs.push({code: 'ger', name: this.translator.instant('lang.ger')});
      this.langs.push({code: 'lat', name: this.translator.instant('lang.lat')});
      for (const code of this.otherLanguages) {
        otherLangs.push({code: code, name: this.translator.instant('lang.' + code)});
      }
      otherLangs.sort((a: any, b: any): number => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      this.langs = this.langs.concat(otherLangs);
    });
  }

  ngOnInit() {
  }

}
