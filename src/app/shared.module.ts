import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { AngularResizeEventModule } from 'angular-resize-event';
import { AngularSplitModule } from 'angular-split';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizecolDirective } from './resizecol.directive';


@NgModule({
  declarations: [ResizecolDirective],
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
    AngularSplitModule,
    ResizecolDirective
  ]
})
export class SharedModule { }
