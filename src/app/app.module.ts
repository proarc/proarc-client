import { EditorIssueComponent } from './components/editor/editor-issue/editor-issue.component';
import { EditorVolumeComponent } from './components/editor/editor-volume/editor-volume.component';
import { EditorRelocationComponent } from './components/editor/editor-relocation/editor-relocation.component';
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
import { ImportComponent } from './components/import/import.component';
import { ImportDialogComponent } from './dialogs/import-dialog/import-dialog.component';
import { HistoryComponent } from './components/import/history/history.component';
import { LogDialogComponent } from './dialogs/log-dialog/log-dialog.component';
import { NewObjectDialogComponent } from './dialogs/new-object-dialog/new-object-dialog.component';
import { CatalogDialogComponent } from './dialogs/catalog-dialog/catalog-dialog.component';
import { ParentDialogComponent } from './dialogs/parent-dialog/parent-dialog.component';
import { CuzkService } from './services/cuzk.service';
import { LocationDialogComponent } from './dialogs/location-dialog/location-dialog.component';
import { ExportDialogComponent } from './dialogs/export-dialog/export-dialog.component';
import { UrnbnbDialogComponent } from './dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { HelpDialogComponent } from './dialogs/help-dialog/help-dialog.component';
import { HelpService } from './services/help.service';
import { ReloadBatchDialogComponent } from './dialogs/reload-batch-dialog/reload-batch-dialog.component';
import { ConfigService } from './services/config.service';
import { EditorChronicleComponent } from './components/editor/editor-chronicle/editor-chronicle.component';
import { EditorChronicleAuthorComponent } from './documents/document/editor-chronicle-author/editor-chronicle-author.component';
import { EditorChronicleNoteComponent } from './documents/document/editor-chronicle-note/editor-chronicle-note.component';
import { EditorChronicleTitleComponent } from './documents/document/editor-chronicle-title/editor-chronicle-title.component';
import { EditorChroniclePublisherComponent } from './documents/document/editor-chronicle-publisher/editor-chronicle-publisher.component';
import { EditorChronicleGenreComponent } from './documents/document/editor-chronicle-genre/editor-chronicle-genre.component';
import { EditorChronicleLocationComponent } from './documents/document/editor-chronicle-location/editor-chronicle-location.component';
import { FundService } from './services/fund.service';
import { FundDialogComponent } from './dialogs/fund-dialog/fund-dialog.component';
import { OsmService } from './services/osm.service';
import { SettingsComponent } from './components/settings/settings.component';
import { NewPasswordDialogComponent } from './dialogs/new-password-dialog/new-password-dialog.component';
import { EditorAbstractComponent } from './documents/document/editor-abstract/editor-abstract.component';
import { AngularSplitModule } from 'angular-split';
import { AngularResizedEventModule } from 'angular-resize-event';
import { EditorPhysicalComponent } from './documents/document/editor-physical/editor-physical.component';
import { TreeComponent } from './components/search/tree/tree.component';
import { SearchService } from './services/search.service';
import { ImportService } from './services/import.service';
import { ImportTreeComponent } from './components/import/tree/tree.component';
import { IngestDialogComponent } from './dialogs/ingest-dialog/ingest-dialog.component';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';
import { PreferredTopsDialogComponent } from './dialogs/preferred-tops-dialog/preferred-tops-dialog.component';


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
    ImportDialogComponent,
    LogDialogComponent,
    SearchComponent,
    DatePipe,
    DatetimePipe,
    ShortenPipe,
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
    EditorPagesComponent,
    EditorRelocationComponent,
    EditorVolumeComponent,
    EditorIssueComponent,
    ImportComponent,
    HistoryComponent,
    NewObjectDialogComponent,
    CatalogDialogComponent,
    ParentDialogComponent,
    LocationDialogComponent,
    ExportDialogComponent,
    UrnbnbDialogComponent,
    HelpDialogComponent,
    ReloadBatchDialogComponent,
    EditorChronicleComponent,
    EditorChronicleAuthorComponent,
    EditorChronicleNoteComponent,
    EditorChronicleTitleComponent,
    EditorChroniclePublisherComponent,
    EditorChronicleGenreComponent,
    EditorChronicleLocationComponent,
    FundDialogComponent,
    SettingsComponent,
    NewPasswordDialogComponent,
    EditorAbstractComponent,
    EditorPhysicalComponent,
    TreeComponent,
    ImportTreeComponent,
    IngestDialogComponent,
    AboutDialogComponent,
    PreferredTopsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularResizedEventModule,
    AngularSplitModule.forRoot(),
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    TranslatorModule.forRoot({
      providedLanguages: ['cs'],
      defaultLanguage: 'cs',
      loaderOptions: {
        path: 'assets/i18n/{{language}}.json?v1.0.3'
      }
    })
  ],
  providers: [
    ApiService,
    AuthService,
    UIService,
    EditorService,
    LocalStorageService,
    CodebookService,
    CuzkService,
    HelpService,
    ConfigService,
    FundService,
    OsmService,
    SearchService,
    ImportService
  ],
  entryComponents: [
    SimpleDialogComponent,
    ImportDialogComponent,
    LogDialogComponent,
    NewObjectDialogComponent,
    CatalogDialogComponent,
    ParentDialogComponent,
    LocationDialogComponent,
    ExportDialogComponent,
    UrnbnbDialogComponent,
    HelpDialogComponent,
    ReloadBatchDialogComponent,
    FundDialogComponent,
    NewPasswordDialogComponent,
    IngestDialogComponent,
    AboutDialogComponent,
    PreferredTopsDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
