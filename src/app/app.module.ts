import { CodebookService } from './services/codebook.service';
import { EditorPagesComponent } from './components/editor/editor-pages/editor-pages.component';
import { EditorMetadataComponent } from './components/editor/editor-metadata/editor-metadata.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { DatetimePipe } from './pipes/datetime.pipe';
import { DatePipe } from './pipes/date.pipe';
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
import { DevicesComponent } from './components/devices/devices.component';
import { DeviceComponent } from './components/devices/device/device.component';
import { EditDeviceComponent } from './components/devices/edit-device/edit-device.component';
import { UIService } from './services/ui.service';
import { SimpleDialogComponent } from './dialogs/simple-dialog/simple-dialog.component';
import { SearchComponent } from './components/search/search.component';
import { AtmComponent } from './components/atm/atm.component';
import { OcrComponent } from './components/ocr/ocr.component';
import { NoteComponent } from './components/note/note.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { EditAudioDeviceComponent } from './components/devices/edit-audio-device/edit-audio-device.component';
import { EditorService } from './services/editor.service';
import { EditorComponent } from './components/editor/editor.component';
import { EditorChildrenComponent } from './components/editor/editor-children/editor-children.component';
import { LocalStorageService } from './services/local-storage.service';
import { EditorOcrComponent } from './components/editor/editor-ocr/editor-ocr.component';
import { EditorModsComponent } from './components/editor/editor-mods/editor-mods.component';
import { EditorCommentComponent } from './components/editor/editor-comment/editor-comment.component';
import { EditorAtmComponent } from './components/editor/editor-atm/editor-atm.component';
import { EditorPageComponent } from './components/editor/editor-page/editor-page.component';
import { EditorGeoComponent } from './components/editor/editor-geo/editor-geo.component';
import { EditorSubjectGeoComponent } from './documents/document/editor-subject-geo/editor-subject-geo.component';


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
    LoginComponent,
    DevicesComponent,
    DeviceComponent,
    EditDeviceComponent,
    SimpleDialogComponent,
    SearchComponent,
    DatePipe,
    DatetimePipe,
    AtmComponent,
    OcrComponent,
    NoteComponent,
    CatalogComponent,
    ViewerComponent,
    EditAudioDeviceComponent,
    EditorComponent,
    EditorChildrenComponent,
    EditorOcrComponent,
    EditorModsComponent,
    EditorCommentComponent,
    EditorAtmComponent,
    EditorPageComponent,
    EditorMetadataComponent,
    EditorGeoComponent,
    EditorSubjectGeoComponent,
    EditorPagesComponent
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
    AuthService,
    UIService,
    EditorService,
    LocalStorageService,
    CodebookService
  ],
  entryComponents: [
    SimpleDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
