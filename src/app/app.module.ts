import { EditorLocationComponent } from './documents/document/editor-location/editor-location.component';
import { ModsEditorComponent } from './documents/document/mods-editor/mods-editor.component';
import { EditorAuthorComponent } from './documents/document/editor-author/editor-author.component';
import { EditorLanguageComponent } from './documents/document/editor-language/editor-language.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentComponent } from './documents/document/document.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './components/app.component';
import { MaterialModule } from './modules/material.module';
import { XmlViewComponent } from './documents/document/mods-xml/xml-view.component';

import { HighlightModule } from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import { EditorTitleComponent } from './documents/document/editor-title/editor-title.component';
import { TranslatorModule } from 'angular-translator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorPublisherComponent } from './documents/document/editor-publisher/editor-publisher.component';
import { PanelComponent } from './documents/document/panel/panel.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { EditorIdentifierComponent } from './documents/document/editor-identifier/editor-identifier.component';
import { EditorNoteComponent } from './documents/document/editor-note/editor-note.component';
import { RelationsComponent } from './documents/relations/relations.component';


export function hljsLanguages() {
  return [
    {name: 'xml', func: xml}
  ];
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DocumentComponent,
    XmlViewComponent,
    EditorTitleComponent,
    EditorLanguageComponent,
    EditorAuthorComponent,
    EditorPublisherComponent,
    EditorIdentifierComponent,
    EditorNoteComponent,
    ModsEditorComponent,
    EditorLocationComponent,
    RelationsComponent,
    PanelComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    TranslatorModule.forRoot({
      providedLanguages: ['en', 'cs'],
      defaultLanguage: 'cs'
    })
  ],
  providers: [
    ApiService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
