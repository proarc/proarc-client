import { Component, inject, input, signal } from '@angular/core';
import { ILayoutPanel } from '../../dialogs/layout-admin/layout-admin.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserSettings } from '../../shared/user-settings';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import { Subscription } from 'rxjs';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-editor-issues',
  imports: [TranslateModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule,
    MatCheckboxModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './editor-issues.component.html',
  styleUrl: './editor-issues.component.scss'
})
export class EditorIssuesComponent {

  public settings = inject(UserSettings);
  private api = inject(ApiService);
  private layout = inject(LayoutService);
  private ui = inject(UIService);
  public translator = inject(TranslateService);

  panel = input<ILayoutPanel>();

  canSave = signal<boolean>(false);
  loading = signal<boolean>(false);
  plurals: string;
  numOfSelected: number;


  partNumberControl = new FormControl();
  signatureControl = new FormControl();
  siglaControl = new FormControl();
  controls: FormGroup = new FormGroup({
    partNumber: this.partNumberControl,
    signature: this.signatureControl,
    sigla: this.siglaControl
  });


  subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(this.layout.selectionChanged().subscribe((fromStructure: boolean) => {
      this.plurals = this.countPlurals();
    }));

    this.controls.valueChanges.subscribe(() => {

      this.canSave.set(this.controls.controls['partNumber'].dirty
        || this.controls.controls['signature'].dirty
        || this.controls.controls['sigla'].dirty
      );
    })
  }

  countPlurals(): string {
    this.numOfSelected = this.layout.getNumOfSelected();
    if (this.numOfSelected > 4) {
      return '5'
    } else if (this.numOfSelected > 1) {
      return '4'
    } else {
      return this.numOfSelected + '';
    }
  }

  onSave() {
    this.loading.set(true);
    this.api.editorObjects(this.layout.getSelected().map(i => i.pid), this.signatureControl.value, this.partNumberControl.value, this.siglaControl.value).subscribe((result: any) => {
      if (result.response.errors) {
        this.ui.showErrorDialogFromObject(result.response.errors);
      } else {


        this.ui.showInfoSnackBar(this.translator.instant('snackbar.changeSaved'), 4000);

        setTimeout(() => {
          this.layout.clearPanelEditing();
          this.layout.refreshSelectedItem(true, 'issues');
        }, 100);

      }
      this.loading.set(false);
      this.controls.markAsPristine();
    });

  }
}
