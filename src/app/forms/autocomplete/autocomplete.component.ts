import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModsElement } from '../../model/mods/element.model';
import { UsageComponent } from '../usage/usage.component';
import { UserSettings } from '../../shared/user-settings';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatTooltipModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    UsageComponent
  ],
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  
  filteredOptions: Observable<[string, string][]>;
  @Output() valueChange = new EventEmitter<string>();

  options: [string, string][];

  constructor(
    public settings: UserSettings,
  private translator: TranslateService) {
  }

  ngOnInit() {
    
    if (this.item.controls[this.field].value !== this.value) {
      this.item.controls[this.field].patchValue(this.value);
    }
    if (!this.item.available[this.field]) {
      return;
    }
    this.options = this.item.options(this.field);
    if (!this.options) {
      return
    }
    this.item.controls[this.field].valueChanges.subscribe(s => {
      this.valueChange.emit(s);
    })
    
    this.filteredOptions = this.item.controls[this.field].valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v))
    );
  }

  private _filter(v: string): [string, string][] {
    const filterValue = v.toLowerCase();
    return this.options.filter(option => this.translator.instant(option[0]).toLowerCase().indexOf(filterValue) === 0);
  }

}
