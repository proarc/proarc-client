import { NgModule } from '@angular/core';
import { MatButtonModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatAutocompleteModule,
  MatPaginatorModule,
  MatTreeModule} from '@angular/material';

  const modules = [
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTreeModule
  ];

  @NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule {}
