import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModsElement } from 'src/app/model/mods/element.model';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  
  filteredOptions: Observable<string[]>;
  @Output() valueChange = new EventEmitter<string>();

  options: string[];

  constructor() {
  }

  ngOnInit() {
    if (!this.item.available(this.field)) {
      return;
    }
    this.options = this.item.options(this.field);
    if (!this.options) {
      return
    }
    
    this.filteredOptions = this.item.controls[this.field].valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v))
    );
  }

  private _filter(v: string): string[] {
    const filterValue = v.toLowerCase();
    return this.options.filter(option => option[1].toLowerCase().indexOf(filterValue) === 0);
  }

}
