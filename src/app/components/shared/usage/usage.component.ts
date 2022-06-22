import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HelpDialogComponent } from 'src/app/dialogs/help-dialog/help-dialog.component';
import { ModsElement } from 'src/app/model/mods/element.model';

@Component({
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
