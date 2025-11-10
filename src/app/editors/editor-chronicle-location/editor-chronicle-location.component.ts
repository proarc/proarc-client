import { Component, OnInit, Input } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { ElementField } from '../../model/mods/elementField.model';
import { FundDialogComponent } from '../../dialogs/fund-dialog/fund-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FundService } from '../../services/fund.service';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatTooltipModule, EditorFieldComponent, MatSelectModule, MatButtonModule, MatIconModule],
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

  constructor(
    private translator: TranslateService, 
    private dialog: MatDialog,
    public fund: FundService,
    public settings: UserSettings) {
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
          alertClass: 'app-message',
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
