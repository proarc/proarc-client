import { CodebookService } from './../../../services/codebook.service';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-pages',
  templateUrl: './editor-pages.component.html',
  styleUrls: ['./editor-pages.component.scss']
})
export class EditorPagesComponent implements OnInit {

  holder: PageUpdateHolder;
  pageTypeControl: FormControl<{ code: string, name: string } | null> = new FormControl<{ code: string, name: string } | null>(null);
  numberingTypesControl: FormControl<{ id: string, label: string } | null> = new FormControl<{ id: string, label: string } | null>(null);
  pageNumberControl = new FormControl();
  pageNumberPrefixControl = new FormControl();
  pageNumberSuffixControl = new FormControl();
  pageNumberIncrementControl = new FormControl();
  pageIndexControl = new FormControl();
  posControl = new FormControl();
  applyControl = new FormControl();
  controls: FormGroup = new FormGroup({
    pageTypeControl: this.pageTypeControl,
    pageNumberControl: this.pageNumberControl,
    pageNumberPrefixControl: this.pageNumberPrefixControl,
    pageNumberSuffixControl: this.pageNumberSuffixControl,
    pageNumberIncrementControl: this.pageNumberIncrementControl,
    pageIndexControl: this.pageIndexControl,
    numberingTypesControl: this.numberingTypesControl,
    posControl: this.posControl,
    applyControl: this.applyControl
  });

  state: string;

  public toolbarTooltipPosition = this.ui.toolbarTooltipPosition;

  constructor(
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public config: ConfigService,
    public layout: LayoutService,
    public codebook: CodebookService) {
  }

  ngOnInit() {
    this.holder = new PageUpdateHolder();
    this.controls.valueChanges.subscribe((e: any) => {
      this.layout.isDirty = this.controls.dirty;
    })
  }

  canSave(): boolean {
    return this.holder.editAny();
  }

  onSave() {
    if (!this.canSave()) {
      return;
    }
    this.updateSelectedPages(this.holder, null);
    // this.holder.reset();
    this.controls.markAsPristine();
    this.layout.isDirty = false;
  }

  addBrackets() {
    this.changeBrackets(this.holder, true, null);
  }

  removeBrackets() {
    this.changeBrackets(this.holder, false, null);
  }

  enterSelect(s: MatSelect) {
    s.close();
    this.onSave();
  }


  updateSelectedPages(holder: PageUpdateHolder, callback: () => void) {
    this.state = 'saving';
    const pages = [];
    for (const item of this.layout.items) {
      if (item.isPage() && item.selected) {
        pages.push(item.pid);
      }
    }
    this.api.editPages(pages, holder, this.layout.getBatchId()).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorSnackBarFromObject(result.response.errors);
        this.state = 'error';
      } else {
        this.layout.refreshSelectedItem(true, 'pages');
        //this.layout.setShouldRefresh(true);
      }
    })
  }

  changeBrackets(holder: PageUpdateHolder, useBrackets: boolean, callback: () => void) {
    this.state = 'saving';
    const pages = [];
    for (const item of this.layout.items) {
      if (item.isPage() && item.selected) {
        pages.push(item.pid);
      }
    }
    this.api.editBrackets(pages, holder, useBrackets, this.layout.getBatchId()).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorSnackBarFromObject(result.response.errors);
        this.state = 'error';
      } else {
        this.layout.refreshSelectedItem(true, 'pages');
        //this.layout.setShouldRefresh(true);
      }
    })
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

  applyOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  editType: boolean;
  editIndex: boolean;
  editNumber: boolean;
  editPosition: boolean;

  useBrackets: boolean;
  doubleColumns: boolean;

  pageType: string;
  pageIndex: number;

  pageNumberFrom: string;
  pageNumberIncrement: number;
  pageNumberPrefix: string;
  pageNumberSuffix: string;
  pageNumberNumbering: any;

  pagePosition: string;

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

    this.pagePosition = '';

    this.applyTo = 1;
    this.applyToFirst = true;
  }

  getPageIndexFrom(): number {
    return this.findIndexInNumbering(this.pageNumberFrom);
  }

  editAny(): boolean {
    return this.editIndex || this.editType || (this.editNumber && this.numberFromValid()) || (this.editPosition && this.pagePosition !== '');
  }

  reset() {
    this.editIndex = false;
    this.editType = false;
    this.editNumber = false;
    this.editPosition = false;
  }

  romanize(num: number): string {
    if (isNaN(num)) {
      return '';
    }
    const digits = String(+num).split('');
    const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
      '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
      '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let roman = '',
      i = 3;
    while (i--) {
      roman = (key[+digits.pop() + (i * 10)] || '') + roman;
    }
    return Array(+digits.join('') + 1).join('M') + roman;
  }



  private romanCharToInt(c: string) {
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
    if (text == null) {
      return 0;
    }
    let result = 0;
    for (let i = 0; i < text.length; i++) {
      const letter = text.substring(i, i + 1);
      const power = text.length - (i + 1);
      const index = this.alphabet.indexOf(letter) + 1;
      result = result + index * Math.pow(26, power);
    }
    return result;
  }

  deromanize(roman: string) {
    if (roman == null) {
      return 0;
    }
    let num = this.romanCharToInt(roman.charAt(0));
    let pre, curr;

    for (let i = 1; i < roman.length; i++) {
      curr = this.romanCharToInt(roman.charAt(i));
      pre = this.romanCharToInt(roman.charAt(i - 1));
      if (curr <= pre) {
        num += curr;
      } else {
        num = num - pre * 2 + curr;
      }
    }
    return num;
  }


  getAlphabetFromNumber(num: number) {
    let str = '';
    let t = 0;
    while (num > 0) {
      t = (num - 1) % 26;
      str = String.fromCharCode(65 + t) + str;
      num = (num - t) / 26 | 0;
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
    } else {
      return -1
    }
  }

  getAsString(num: number) {
    let result = this.pageNumberPrefix;
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
    result = result + this.pageNumberSuffix;
    if (this.useBrackets) {
      result = '[' + result + ']';
    }
    return result;
  }

  getNumberForIndex(index: number, checkDouble = true) {
    let num = this.findIndexInNumbering(this.pageNumberFrom);
    let idx = this.doubleColumns ? index * 2 : index;
    num += this.pageNumberIncrement * idx;
    let result = this.getAsString(num);
    if (checkDouble && this.doubleColumns) {
      result += ',' + this.getAsString(num + this.pageNumberIncrement);
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
    return false;
  }

  getNumberingExample(): string {
    if (this.pageNumberFrom && this.numberFromValid()) {
      return `${this.getNumberForIndex(0)}; ${this.getNumberForIndex(1)}; ${this.getNumberForIndex(2)}; ${this.getNumberForIndex(3)}`;
    }
    return '';
  }

}
