import { Component, input, Input, OnInit, signal } from '@angular/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { ApiService } from '../../services/api.service';
import { LayoutService, PageUpdateHolder } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Utils } from '../../utils/utils';

@Component({
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  selector: 'app-editor-pages',
  templateUrl: './editor-pages.component.html',
  styleUrls: ['./editor-pages.component.scss']
})
export class EditorPagesComponent implements OnInit {

  panel = input<ILayoutPanel>();

  holder: PageUpdateHolder;

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


  pageTypeControl: FormControl<{ code: string, name: string } | null> = new FormControl<{ code: string, name: string } | null>(null);
  pageNumberNumberingControl: FormControl<string | null> = new FormControl<string | null>(this.numberingTypes[0].id);
  pageNumberFromControl = new FormControl();
  pageNumberPrefixControl = new FormControl();
  pageNumberSuffixControl = new FormControl();
  pageNumberIncrementControl = new FormControl();
  pageIndexControl = new FormControl();
  pagePositionControl = new FormControl();
  applyToControl = new FormControl();
  useBracketsControl = new FormControl(false);
  repreSelectControl = new FormControl(false);
  doubleColumnsControl = new FormControl(false);
  applyToFirstControl = new FormControl();
  controls: FormGroup = new FormGroup({
    pageType: this.pageTypeControl,
    pageIndex: this.pageIndexControl,
    useBrackets: this.useBracketsControl,
    repreSelect: this.repreSelectControl,
    doubleColumns: this.doubleColumnsControl,
    pageNumberNumbering: this.pageNumberNumberingControl,
    pageNumberFrom: this.pageNumberFromControl,
    pageNumberPrefix: this.pageNumberPrefixControl,
    pageNumberSuffix: this.pageNumberSuffixControl,
    pageNumberIncrement: this.pageNumberIncrementControl,
    pagePosition: this.pagePositionControl,
    applyToFirst: this.applyToFirstControl,
    applyTo: this.applyToControl
  });


  state: string;
  plurals: string;
  numOfSelected: number;
  subscriptions: Subscription[] = [];
  numberingExample = signal<string>('');

  constructor(
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public translator: TranslateService,
    public config: Configuration,
    public layout: LayoutService) {
  }

  ngOnInit() {
    this.holder = new PageUpdateHolder();
    this.holder.pageNumberNumbering = this.numberingTypes[0].id;
    if (this.layout.lastPageUpdateHolder) {
      this.holder.fillValues(this.layout.lastPageUpdateHolder);
    }
    this.initControls();

    this.controls.valueChanges.subscribe(() => {
      this.canSave = true;
      this.setPanelEditing();
      this.numberingExample.set(this.getNumberingExample());
    })

    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      this.plurals = this.countPlurals();
    }));
  }

  setPageHolder() {
    this.layout.lastPageUpdateHolder = new PageUpdateHolder();
    this.layout.lastPageUpdateHolder.fillValues(this.controls.value);
  }

  initControls() {
    this.controls.patchValue(this.holder);
    this.pageNumberNumberingControl.setValue(this.holder.pageNumberNumbering);
    this.controls.markAsPristine();
  }

  onRevert() {
    this.controls.reset();
    this.pageNumberNumberingControl.setValue(this.numberingTypes[0].id);
    this.controls.markAsPristine();
    this.canSave = false;
    this.setPanelEditing();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  countPlurals(): string {
    this.numOfSelected = this.layout.getNumOfSelected();
    if (this.numOfSelected > 4) {
      return '5'
    } else if (this.numOfSelected > 1) {
      return '4'
    } else {
      return this.numOfSelected + '';
    }
  }

  canSave: boolean;
  setPanelEditing() {
    setTimeout(() => {
      if (this.canSave) {
        this.layout.setPanelEditing(this.panel());
      } else {
        if (this.panel().canEdit) {
          this.layout.clearPanelEditing();
        }
      }
    }, 100);

  }

  onSave() {
    if (!this.canSave) {
      return;
    }
    this.holder.fillValues(this.controls.value);

    this.updateSelectedPages(this.holder, null);
    
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
    for (const item of this.layout.items()) {
      if (item.isPage() && item.selected) {
        pages.push(item.pid);
      }
    }
    this.setPageHolder();
    this.api.editPages(pages, holder, this.layout.batchId, this.numberFromValid(), this.findIndexInNumbering(this.pageNumberFromControl.value)).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
        this.state = 'error';
      } else {

        if (this.layout.type !== 'repo') {
          this.ui.showInfoSnackBar(this.translator.instant('snackbar.changeSaved'), 4000);
        }
        setTimeout(() => {
          this.layout.clearPanelEditing();
          // this.layout.setShouldRefresh(true);
          this.layout.refreshSelectedItem(true, 'pages');
        }, 100);
        
        this.state = 'success';
      }
    
      this.controls.markAsPristine();
    });
  }

  changeBrackets(holder: PageUpdateHolder, useBrackets: boolean, callback: () => void) {
    this.state = 'saving';
    const pages = [];
    for (const item of this.layout.items()) {
      if (item.isPage() && item.selected) {
        pages.push(item.pid);
      }
    }
    this.api.editBrackets(pages, holder, useBrackets, this.layout.batchId).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
        this.state = 'error';
      } else {
        this.layout.refreshSelectedItem(true, 'pages');
        this.state = 'success';
        // this.layout.setShouldRefresh(true);
      }
    })
  }

  getNumberingExample(): string {
    if (this.pageNumberFromControl.value && this.numberFromValid()) {
      return `${this.getNumberForIndex(0)}; ${this.getNumberForIndex(1)}; ${this.getNumberForIndex(2)}; ${this.getNumberForIndex(3)}`;
    }
    return '';
  }

  numberFromValid(): boolean {

    if (this.pageNumberNumberingControl.value === this.numberingTypes[0].id) {
      return new RegExp(/^\d+$/).test(this.pageNumberFromControl.value);
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[1].id) {
      return new RegExp(/^[IVXCLMD]+$/).test(this.pageNumberFromControl.value.toLocaleUpperCase());
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[2].id) {
      return new RegExp(/^[IVXCLMD]+$/).test(this.pageNumberFromControl.value.toLocaleUpperCase());
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[3].id) {
      return new RegExp(/^[A-Za-z]+$/).test(this.pageNumberFromControl.value);
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[4].id) {
      return new RegExp(/^[A-Za-z]+$/).test(this.pageNumberFromControl.value);
    }
    return false;
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
    if (this.pageNumberNumberingControl.value == this.numberingTypes[0].id) {
      return parseInt(number);
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[1].id) {
      return this.deromanize(number.toUpperCase());
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[2].id) {
      return this.deromanize(number.toUpperCase());
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[3].id) {
      return this.alphabetIndex(number.toLocaleLowerCase());
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[4].id) {
      return this.alphabetIndex(number.toLocaleLowerCase());
    } else {
      return -1
    }
  }

  getAsString(num: number) {
    let result = this.pageNumberPrefixControl.value;
    if (this.pageNumberNumberingControl.value === this.numberingTypes[0].id) {
      result += String(num);
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[1].id) {
      result += this.romanize(num);
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[2].id) {
      result += this.romanize(num).toLowerCase();
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[3].id) {
      result += this.getAlphabetFromNumber(num);
    } else if (this.pageNumberNumberingControl.value === this.numberingTypes[4].id) {
      result += this.getAlphabetFromNumber(num).toLocaleLowerCase();
    }
    result = result + this.pageNumberSuffixControl.value;
    if (this.useBracketsControl.value) {
      result = '[' + result + ']';
    }
    return result;
  }

  getNumberForIndex(index: number, checkDouble = true) {
    let num = this.findIndexInNumbering(this.pageNumberFromControl.value);
    let idx = this.doubleColumnsControl.value ? index * 2 : index;
    num += this.pageNumberIncrementControl.value * idx;
    let result = this.getAsString(num);
    if (checkDouble && this.doubleColumnsControl.value) {
      result += ',' + this.getAsString(num + this.pageNumberIncrementControl.value);
    }
    return result
  }

}


