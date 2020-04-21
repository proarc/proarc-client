import { CodebookService } from './../../../services/codebook.service';
import { Component, OnInit } from '@angular/core';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-editor-pages',
  templateUrl: './editor-pages.component.html',
  styleUrls: ['./editor-pages.component.scss']
})
export class EditorPagesComponent implements OnInit {

  holder: PageUpdateHolder;

  

  constructor(public editor: EditorService, public codebook: CodebookService) {
  }

  ngOnInit() {
    this.holder = new PageUpdateHolder();

  }

  canSave(): boolean {
    return this.holder.editAny();
  }

  onSave() {
    if (!this.canSave()) {
      return;
    }
    this.editor.editSelectedPages(this.holder, null);
  }


}


export class PageUpdateHolder {

  numberingTypes = ['1, 2, 3, 4', 'I, II, III, IV', 'i, ii, iii, iv'];

  editType: boolean;
  editIndex: boolean;
  editNumber: boolean;

  pageType: string;
  pageIndex: number;

  pageNumberFrom: number;
  pageNumberIncrement: number;
  pageNumberPrefix: string;
  pageNumberSuffix: string;
  pageNumberNumbering: string;



  constructor() {
    this.editType = false;
    this.editIndex = false;
    this.editNumber = false;
    this.pageType = 'normalPage';
    this.pageIndex = 1;

    this.pageNumberFrom = 1;
    this.pageNumberIncrement = 1;
    this.pageNumberPrefix = '';
    this.pageNumberSuffix = '';
    this.pageNumberNumbering = this.numberingTypes[0];
  }

  editAny(): boolean {
    return this.editIndex || this.editNumber || this.editType;
  }

  romanize(num: number): string {
    if (isNaN(num)) {
        return '';
    }
    const digits = String(+num).split('');
    const  key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
               '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
               '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let roman = '',
    i = 3;
    while (i--) {
      roman = (key[+digits.pop() + (i * 10)] || '') + roman;
    }
    return Array(+digits.join('') + 1).join('M') + roman;
  }


  getNumberForIndex(index: number) {
    let result = this.pageNumberPrefix;
    const num = this.pageNumberFrom + this.pageNumberIncrement * index;
    if (this.pageNumberNumbering === this.numberingTypes[0]) {
      result += String(num);
    } else if (this.pageNumberNumbering === this.numberingTypes[1]) {
      result += this.romanize(num);
    } else if (this.pageNumberNumbering === this.numberingTypes[2]) {
      result += this.romanize(num).toLowerCase();
    }
    return result + this.pageNumberSuffix;
  }

  getNumberingExample(): string {
    return `${this.getNumberForIndex(0)}, ${this.getNumberForIndex(1)}, ${this.getNumberForIndex(2)}, ${this.getNumberForIndex(3)}`;
  }

}
