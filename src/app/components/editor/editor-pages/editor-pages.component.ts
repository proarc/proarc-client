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
    // this.editor.editSelectedPages(this.holder, null);
    this.editor.updateSelectedPages(this.holder, null);
  }

  addBrackets() {
    this.editor.changeBrackets(this.holder, true, null);
  }

  removeBrackets() {
    this.editor.changeBrackets(this.holder, false, null);
  }
}


export class PageUpdateHolder {

  alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  numberingTypes = [
    {
      id: 'ARABIC_SERIES',
      label: '1, 2, 3, 4',
    },
    {
      id: 'ROMAN_UPPER_SERIES',
      label: 'I, II, III, IV',
    },
    {
      id: 'ROMAN_LOWER_SERIES',
      label: 'i, ii, iii, iv',
    },
    {
      id: 'ALPHABET_UPPER_SERIES',
      label: 'A - Z, AA - AZ',
    },
    {
      id: 'ALPHABET_LOWER_SERIES',
      label: 'a - z, aa - az',
    }
  ];

  applyOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

  editType: boolean;
  editIndex: boolean;
  editNumber: boolean;

  useBrackets: boolean;

  pageType: string;
  pageIndex: number;

  pageNumberFrom: string;
  pageNumberIncrement: number;
  pageNumberPrefix: string;
  pageNumberSuffix: string;
  pageNumberNumbering: any;

  applyTo: number;
  applyToFirst: boolean;

  constructor() {
    this.editType = false;
    this.editIndex = false;
    this.editNumber = false;
    this.pageType = 'normalPage';
    this.pageIndex = 1;

    this.pageNumberFrom = "";
    this.pageNumberIncrement = 1;
    this.pageNumberPrefix = '';
    this.pageNumberSuffix = '';
    this.pageNumberNumbering = this.numberingTypes[0];

    this.applyTo = 1;
    this.applyToFirst = true;
  }

  getPageIndexFrom(): number {
    return this.findIndexInNumbering(this.pageNumberFrom);
  }

  editAny(): boolean {
    return this.editIndex || this.editType || (this.editNumber && this.numberFromValid());
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



  private romanCharToInt(c) {
    switch (c) {
      case 'I': return 1;
      case 'V': return 5;
      case 'X': return 10;
      case 'L': return 50;
      case 'C': return 100;
      case 'D': return 500;
      case 'M': return 1000;
      default: return -1;
    }
  }

  alphabetIndex(text: string) {
    if(text == null) { 
      return 0;
    }
    let result = 0;
    for(let i = 0; i < text.length; i++){
      const letter = text.substring(i, i + 1);
      const power = text.length - (i + 1);
      const index = this.alphabet.indexOf(letter) + 1;
      result = result + index * Math.pow(26, power);
    }
    return result;
  }

  deromanize(roman: string) {
    if(roman == null) {
      return 0;
    }
    let num = this.romanCharToInt(roman.charAt(0));
    let pre, curr;
  
    for(let i = 1; i < roman.length; i++){
      curr = this.romanCharToInt(roman.charAt(i));
      pre = this.romanCharToInt(roman.charAt(i-1));
      if(curr <= pre) {
        num += curr;
      } else {
        num = num - pre*2 + curr;
      }
    }
    return num;
  }
  

  getAlphabetFromNumber(num) {
    let str = '';
    let t = 0;
    while (num > 0) {
      t = (num - 1) % 26;
      str = String.fromCharCode(65 + t) + str;
      num = (num - t)/26 | 0;
    }
    return str;
  }

  findIndexInNumbering(number: string): number {
    if (this.pageNumberNumbering == this.numberingTypes[0]) {
      return parseInt(number);
    } else if (this.pageNumberNumbering == this.numberingTypes[1]) {
      return this.deromanize(number.toUpperCase());
    } else if (this.pageNumberNumbering == this.numberingTypes[2]) {
      return this.deromanize(number.toUpperCase());
    } else if (this.pageNumberNumbering == this.numberingTypes[3]) {
      return this.alphabetIndex(number.toLocaleLowerCase());
    } else if (this.pageNumberNumbering == this.numberingTypes[4]) {
      return this.alphabetIndex(number.toLocaleLowerCase());
    }
  }


  getNumberForIndex(index: number) {
    let result = this.pageNumberPrefix;
    let num = this.findIndexInNumbering(this.pageNumberFrom);
    num += this.pageNumberIncrement * index;
    if (this.pageNumberNumbering === this.numberingTypes[0]) {
      result += String(num);
    } else if (this.pageNumberNumbering === this.numberingTypes[1]) {
      result += this.romanize(num);
    } else if (this.pageNumberNumbering === this.numberingTypes[2]) {
      result += this.romanize(num).toLowerCase();
    } else if (this.pageNumberNumbering === this.numberingTypes[3]) {
      result += this.getAlphabetFromNumber(num);
    } else if (this.pageNumberNumbering === this.numberingTypes[4]) {
      result += this.getAlphabetFromNumber(num).toLocaleLowerCase();
    }
    result = result + this.pageNumberSuffix;;
    if (this.useBrackets) {
      return '[' + result + ']';
    }
    return result
  }

  numberFromValid(): boolean {
    if (!this.pageNumberFrom) {
      return false;
    }
    if (this.pageNumberNumbering === this.numberingTypes[0]) {
      return new RegExp(/^\d+$/).test(this.pageNumberFrom);
    } else if (this.pageNumberNumbering === this.numberingTypes[1]) {
      return new RegExp(/^[IVXCLMD]+$/).test(this.pageNumberFrom.toLocaleUpperCase());
    } else if (this.pageNumberNumbering === this.numberingTypes[2]) {
      return new RegExp(/^[IVXCLMD]+$/).test(this.pageNumberFrom.toLocaleUpperCase());
    } else if (this.pageNumberNumbering === this.numberingTypes[3]) {
      return new RegExp(/^[A-Za-z]+$/).test(this.pageNumberFrom);
    } else if (this.pageNumberNumbering === this.numberingTypes[4]) {
      return new RegExp(/^[A-Za-z]+$/).test(this.pageNumberFrom);
    }
  }

  getNumberingExample(): string {
    if (this.pageNumberFrom && this.numberFromValid()) {
      return `${this.getNumberForIndex(0)}, ${this.getNumberForIndex(1)}, ${this.getNumberForIndex(2)}, ${this.getNumberForIndex(3)}`;
    }
  }

}
