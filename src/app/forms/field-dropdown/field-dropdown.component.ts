
import { CommonModule } from '@angular/common';
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

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatTooltipModule, MatSelectModule,
    MatFormFieldModule, MatInputModule, UsageComponent],
  selector: 'app-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss']
})
export class FieldDropdownComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
    if (this.item.controls[this.field].value !== this.value) {
      this.item.controls[this.field].patchValue(this.value);
    }
      // this.item.controls[this.field].valueChanges.subscribe((e: any) => {
      //   this.valueChange.emit(e);
      //   console.log(e)
      // })
  }

}
