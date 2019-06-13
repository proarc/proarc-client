import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentComponent } from './documents/document/document.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './components/app.component';
import { MaterialModule } from './modules/material.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DocumentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
