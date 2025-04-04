import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModsElement } from '../../model/mods/element.model';
import { HelpDialogComponent } from '../../dialogs/help-dialog/help-dialog.component';

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule],
  selector: 'app-usage',
  templateUrl: './usage.component.html'
})
export class UsageComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  
  constructor(private dialog: MatDialog, private translator: TranslateService) {
  }

  ngOnInit() {
  }

  openHelpDialog(event: any) {
    event.stopPropagation();
    if (this.item.showHelp(this.field)) {
      this.dialog.open(HelpDialogComponent, { data: this.item.help(this.field, this.translator) });
    }
  }

}
