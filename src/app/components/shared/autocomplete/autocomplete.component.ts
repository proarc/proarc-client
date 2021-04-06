import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() innerClass: string;
  @Input() label: string;
  @Input() value: string;
  @Input() usage: string;
  @Input() options: string[];

  control = new FormControl();
  filteredOptions: Observable<string[]>;
  @Output() valueChange = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(v => this._filter(v))
    );
  }

  private _filter(v: string): string[] {
    const filterValue = v.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
