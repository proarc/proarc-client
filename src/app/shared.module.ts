import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { AngularResizeEventModule } from 'angular-resize-event';
import { AngularSplitModule } from 'angular-split';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularResizeEventModule,
    AngularSplitModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularResizeEventModule,
    AngularSplitModule
  ]
})
export class SharedModule { }
