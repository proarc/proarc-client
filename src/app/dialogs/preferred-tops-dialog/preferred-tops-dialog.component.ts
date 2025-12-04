

import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule, FormsModule, MatFormFieldModule, MatCheckboxModule, MatSlideToggleModule],
  selector: 'app-preferred-tops-dialog',
  templateUrl: './preferred-tops-dialog.component.html',
  styleUrls: ['./preferred-tops-dialog.component.scss']
})
export class PreferredTopsDialogComponent implements OnInit {

  checked: any = {};
  items: {name: string, selected: boolean}[];
  relatedItemExpanded: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      prefix: string, top: string[], 
      conf: string[], 
      expanded: boolean,
      relatedItemExpanded: boolean },
    private dialogRef: MatDialogRef<PreferredTopsDialogComponent>,
    private translator: TranslateService) {
  }

  ngOnInit() {

    let top: string[];
    let rest: string[];
    
    this.items = [];
    top = this.data.conf.filter((a: string) => this.data.top.includes(a));
    rest =  this.data.conf.filter((a: string) => !this.data.top.includes(a));
    const kk: string[] = [];
    rest.sort((a: any, b: any) => {
      const a1: string = this.translator.instant(this.data.prefix + '.' + a.toLocaleLowerCase()).toLocaleLowerCase();
      const b1: string = this.translator.instant(this.data.prefix + '.' + b.toLocaleLowerCase()).toLocaleLowerCase();
      return a1.localeCompare(b1, 'cs')
    });
    top.forEach(a => {
      this.items.push({name: a, selected: true});
    })
    rest.forEach(a => {
      this.items.push({name: a, selected: false});
      kk.push(this.translator.instant(this.data.prefix + '.' + a));
    });
    this.relatedItemExpanded = this.data.relatedItemExpanded;


    // if (this.data == 'PageTypes') {
    //   this.items = this.codebook.pageTypes;
    // } else if (this.data == 'Languages') {
    //   this.items = this.codebook.languages;
    // } else if (this.data == 'Locations') {
    //   this.items = this.codebook.locations;
    // } else if (this.data == 'Identifiers') {
    //   this.items = this.codebook.identifiers;
    // } else if (this.data == 'ExpandedModels') {
    //   this.items = this.codebook.expandedModels;
    // } else {
    //   this.items = [];
    // }
    // this.checked = {};
    // for (const code of this.codebook.getTopCodes(this.data)) {
    //   this.checked[code] = true;
    // }
    // if (localStorage.getItem('relatedItemExpanded')) {
    //   this.relatedItemExpanded = localStorage.getItem('relatedItemExpanded') === 'true';
    // }
  }

  onSave() {
    this.data.top = [];
    this.items.forEach(i => {
      if (i.selected) {
        this.data.top.push(i.name)
      }
    });
    // const codes = [];
    // for (const item of this.items) {
    //   if (this.checked[item.code]) {
    //     codes.push(item.code);
    //   }
    // }
    // this.codebook.setNewTopsInCollection(this.data, codes);
    // if (this.data == 'ExpandedModels') {
    //   localStorage.setItem('relatedItemExpanded', JSON.stringify(this.relatedItemExpanded));
    // }
    this.dialogRef.close({top: this.data.top, relatedItemExpanded: this.relatedItemExpanded});
  }

}
