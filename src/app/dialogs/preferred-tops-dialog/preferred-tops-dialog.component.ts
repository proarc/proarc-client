
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CodebookService } from 'src/app/services/codebook.service';

@Component({
  selector: 'app-preferred-tops-dialog',
  templateUrl: './preferred-tops-dialog.component.html',
  styleUrls: ['./preferred-tops-dialog.component.scss']
})
export class PreferredTopsDialogComponent implements OnInit {

  checked = {};
  items: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
          private dialogRef: MatDialogRef<PreferredTopsDialogComponent>,
              private codebook: CodebookService) { 
  }

  ngOnInit() {
    if (this.data == 'PageTypes') {
      this.items = this.codebook.pageTypes;
    } else if (this.data == 'Languages') {
      this.items = this.codebook.languages;
    } else if (this.data == 'Identifiers') {
      this.items = this.codebook.identifiers;
    } else {
      this.items = [];
    }
    this.checked = {};
    for (const code of this.codebook.getTopCodes(this.data)) {
      this.checked[code] = true;
    }
  }

  onSave() {
    const codes = [];
    for (const item of this.items) {
      if (this.checked[item.code]) {
        codes.push(item.code);
      }
    }
    this.codebook.setNewTopsInCollection(this.data, codes);
    this.dialogRef.close();
  }

}
