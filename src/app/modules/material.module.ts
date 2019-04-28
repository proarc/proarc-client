import { NgModule } from '@angular/core';
import { MatButtonModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatSnackBarModule,
  MatCheckboxModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule
  ]
})
export class MaterialModule {}
