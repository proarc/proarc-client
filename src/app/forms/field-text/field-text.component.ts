

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ModsElement } from '../../model/mods/element.model';
import { UsageComponent } from "../usage/usage.component";
import { MatInputModule } from '@angular/material/input';
import { Utils } from '../../utils/utils';
import { UserSettings } from '../..//shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, MatInputModule, MatFormFieldModule, UsageComponent],
  selector: 'app-field-text',
  templateUrl: './field-text.component.html',
  styleUrls: ['./field-text.component.scss']
})
export class FieldTextComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() key: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();


  constructor(public settings: UserSettings) {
  }

  ngOnInit() {
    if (this.item.controls[this.field]) {
      if (this.item.controls[this.field].value !== this.value) {
        this.item.controls[this.field].patchValue(this.value);
      }
      this.item.controls[this.field].valueChanges.subscribe((e: any) => {
        this.valueChange.emit(e);
        Utils.metadataChanged.update(n => n + 1);
      });
    }
  }

}
