
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { EditorFieldComponent } from '../../forms/editor-field/editor-field.component';
import { FieldDropdownComponent } from '../../forms/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from '../../forms/field-text/field-text.component';
import { ElementField } from '../../model/mods/elementField.model';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { UIService } from '../../services/ui.service';
import { MatRadioModule } from '@angular/material/radio';
import { AutocompleteComponent } from "../../forms/autocomplete/autocomplete.component";
import { MatButtonModule } from '@angular/material/button';


@Component({
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, 
  MatRadioModule, EditorFieldComponent, FieldDropdownComponent, FieldTextComponent, AutocompleteComponent, MatButtonModule],
  selector: 'app-editor-genre',
  templateUrl: './editor-genre.component.html',
  styleUrls: ['./editor-genre.component.scss']
})
export class EditorGenreComponent implements OnInit {

  @Input() field: ElementField;
  @Input() showGenreSwitch: boolean;

  peerControl = new FormControl();
  oldType: string;

  constructor(
    private api: ApiService,
    private layout: LayoutService,
    private ui: UIService,
    private dialog: MatDialog,
    private translator: TranslateService,) {
  }

  ngOnInit() {
    // console.log(this.field.isPeerReviewed)
    if (this.field.isPeerReviewed && this.field.items.length === 1) {
      // this.field.addAsFirst();
    }

  }

  ngOnChanges(c: SimpleChanges) {
    this.field.getItems()[0].controls['peer-reviewed'].setValue(this.field.isPeerReviewed);
    this.peerControl.setValue(this.field.isPeerReviewed);
  }

  switchChanged(e: any) {
    // this.field.isPeerReviewed = e.value === 'peer-reviewed';
    if (this.field.isPeerReviewed) {
      //const item = this.field.addAsFirst();
      if (this.field.items.length === 1 && this.field.getItems()[0].attrs['type']) {
        const item = this.field.addAsFirst();
      }
      this.field.getItems()[0].controls['peer-reviewed'].setValue(true);
      this.field.items[0].attrs['type'] = 'peer-reviewed';
      this.field.items[0].setAsDirty();
    } else {
      delete this.field.getItems()[0].attrs['type'];
      if (this.field.items.length > 1) {
        this.field.remove(0);
      }
      //this.field.remove(0);
    }
      this.field.items[0].setAsDirty();

      setTimeout(() => {
        //this.layout.setMetadataResized();
      }, 10);
  }

  typeChanged(e: any, idx: number) {
    // console.log(e, idx)
    if (!this.showGenreSwitch) {
      return;
    }
    if (idx === 0 && e === 'peer-reviewed') {
      // se meni prvni element na 'peer-reviewed'. To jen pomoci switcher
      // pokud mame jen jeden item nic
    } else if (idx === 0 && e !== 'peer-reviewed') {
      // meni na neco jineho prvni element
      // pokud clanek je recenzovan musime pridat item
      if (this.field.isPeerReviewed) {
        const item = this.field.addAsFirst();
        item.controls['peer-reviewed'].setValue(true);
        item.attrs['type'] = 'peer-reviewed';
        item.setAsDirty();
        setTimeout(() => {
          //this.layout.setMetadataResized();
        }, 10);
      }
    }
  }

  addReference(){
    const checkbox = {
      label: String(this.translator.instant('dialog.addReferences.structured')),
      checked: true
    };
    const data: SimpleDialogData = {
      title: String(this.translator.instant('dialog.addReferences.title')),
      message: String(this.translator.instant('dialog.addReferences.message')),
      textAreaInput: { label: 'Obsah', value: '' },
      alertClass: 'app-info',
      btn1: {
        label: String(this.translator.instant('dialog.addReferences.action1')),
        value: 'yes',
        color: 'primary'
      },
      btn2: {
        label: String(this.translator.instant('dialog.addReferences.action2')),
        value: 'no',
        color: 'default'
      },
      checkbox,
      rows: 10
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { 
      data: data,
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        // console.log(this.field, data.textAreaInput.value, checkbox.checked);
        this.api.addReference(this.layout.lastSelectedItem().pid, checkbox.checked, data.textAreaInput.value).subscribe((response: any) => {
          if (response['response'].errors) {
            this.ui.showErrorDialogFromObject(response['response'].errors);
            return;
          } else if (response['response'].data[0].validation) {
            this.ui.showErrorDialogFromString(response['response'].data[0].validation);
            return;
          } else {
            this.ui.showInfoSnackBar(String(this.translator.instant('dialog.addReferences.success')));
            this.layout.setShouldRefresh(false);
          }
        })
      }
    });
  }

}
