

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ModsElement } from '../../model/mods/element.model';
import { UsageComponent } from '../usage/usage.component';
import { MatInputModule } from '@angular/material/input';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, MatSelectModule, MatFormFieldModule, MatInputModule, UsageComponent],
  selector: 'app-field-codebook',
  templateUrl: './field-codebook.component.html',
  styleUrls: ['./field-codebook.component.scss']
})
export class FieldCodebookComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() prefix: string;
  @Input() value: string;
  @Input() options: any;
  @Input() showCode: boolean;
  @Output() valueChange = new EventEmitter<string>();

  constructor(public settings: UserSettings) {
  }

  ngOnInit() {
  }

  

}
