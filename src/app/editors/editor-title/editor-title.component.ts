import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Configuration } from '../../shared/configuration';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ElementField } from '../../model/mods/elementField.model';
import { ModsTitle } from '../../model/mods/title.model';
import { EditorFieldComponent } from "../../forms/editor-field/editor-field.component";
import { UsageComponent } from "../../forms/usage/usage.component";
import { FieldDropdownComponent } from "../../forms/field-dropdown/field-dropdown.component";
import { FieldTextComponent } from "../../forms/field-text/field-text.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FieldCodebookComponent } from "../../forms/field-codebook/field-codebook.component";
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatTooltipModule, MatSlideToggleModule,
    MatFormFieldModule, MatInputModule,
    EditorFieldComponent, UsageComponent, FieldDropdownComponent, FieldTextComponent, FieldCodebookComponent],
  selector: 'app-editor-title',
  templateUrl: './editor-title.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-title.component.scss']
})
export class EditorTitleComponent implements OnInit {

  @Input() field: ElementField;
  @ViewChild('templateContent') templateContent: any;

  constructor(public config: Configuration) {
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.field.items.forEach((item: any) => {
      Object.keys(item.controls).forEach(c => {
        if (c === 'title') {
          item.controls[c].patchValue(item.title["_"])
          item.controls[c].valueChanges.subscribe((e: any) => {
            item.title["_"] = e;
          });
        }
      });
      
    })
  }

  checkNonSort(item: any) {
    item.isNonSortToggleDisabled = item.nonSortToggleDisabled();
  }

  log(e: any) {
    console.log(e)
  }

}
