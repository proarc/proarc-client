import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UIService } from '../../services/ui.service';
import { Configuration } from '../../shared/configuration';
import { UserSettings, UserSettingsService } from '../../shared/user-settings';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-colors-settings-dialog',
  imports: [TranslateModule, FormsModule, MatInputModule, MatFormFieldModule,
    MatDialogModule, CdkDropList, CdkDrag, 
    MatSelectModule, MatIconModule, MatButtonModule, 
    MatTooltipModule, MatCardModule],
  templateUrl: './colors-settings-dialog.component.html',
  styleUrl: './colors-settings-dialog.component.scss'
})
export class ColorsSettingsDialogComponent {

  fields: string[] = [];
  operators = ['exists', 'equals', 'contains', 'greater', 'smaller'];

  colorsConfig: {field: string, color: string, bgcolor: string, operator: string, scope: string, value: string}[];

  newColorConfig: {field: string, color: string, bgcolor: string, operator: string, scope: string, value: string} = 
  {field: '', color: '', bgcolor: '', operator: '', scope: '', value: ''};

  constructor(
    public dialogRef: MatDialogRef<ColorsSettingsDialogComponent>,
    private translator: TranslateService,
    private ui: UIService,
    public settings: UserSettings,
    public settingsService: UserSettingsService,
    public config: Configuration) { }

  ngOnInit(): void {
    this.colorsConfig = this.settings.colorsConfig;
    this.fields = this.settings.columnsWorkFlow.map(c => c.field);
  }

  canAdd() {
    return this.newColorConfig.field && this.newColorConfig.operator && this.newColorConfig.scope && (this.newColorConfig.color || this.newColorConfig.bgcolor)
  }

  add() {
    if (!this.canAdd()) {
      return
    }
    this.colorsConfig.push(({...this.newColorConfig}));
    this.newColorConfig = {field: '', color: '', bgcolor: '', operator: '', scope: '', value: ''};
  }

   save() {
    console.log(this.colorsConfig)
    this.settings.colorsConfig = this.colorsConfig;
    // this.settingsService.save();
    this.dialogRef.close(true);
  }

  drop(event: CdkDragDrop<string[]>) {
    const list: any[] = this.colorsConfig;
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }
}
