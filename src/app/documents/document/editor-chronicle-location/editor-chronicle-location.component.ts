import { Component, OnInit, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { FundService } from 'src/app/services/fund.service';
import { FundDialogComponent } from 'src/app/dialogs/fund-dialog/fund-dialog.component';

@Component({
  selector: 'app-editor-chronicle-location',
  templateUrl: './editor-chronicle-location.component.html',
  styleUrls: ['./editor-chronicle-location.component.scss']
})
export class EditorChronicleLocationComponent implements OnInit {

  @Input() field: ElementField;

  archives = [
    { code: "226102010", name: "SOkA Jihlava" },
    { code: "226103010", name: "SOkA Pelhřimov" },
    { code: "226101010", name: "SOkA Havlíčkův Brod" },
    { code: "226104010", name: "SOkA Třebíč" },
    { code: "226105010", name: "SOkA Žďár nad Sázavou" }
  ];

  constructor(private translator: TranslateService, private dialog: MatDialog, public fund: FundService) {
  }

  ngOnInit() {
  }

  lookupFund(loacation: any) {
    const archive = loacation["$"]["type"];
    if (!archive) {
      // this.translator.waitForTranslation().then(() => {
        const data: SimpleDialogData = {
          title: String(this.translator.instant('editor.chronicle.location.archive_not_selected_title')),
          message: String(this.translator.instant('editor.chronicle.location.archive_not_selected_message')),
          btn1: {
            label: String(this.translator.instant('common.ok')),
            value: 'no',
            color: 'primary'
          }
        };
        this.dialog.open(SimpleDialogComponent, { data: data });
      // });
      return;
    }
    const dialogRef = this.dialog.open(FundDialogComponent, { data: archive });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['id']) {
        loacation['_'] = result['id'];
        loacation["$"]["displayLabel"] = result['name'];
      }
    });
  }

}
