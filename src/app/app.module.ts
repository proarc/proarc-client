import { EditorRelocationComponent } from './components/editor/editor-relocation/editor-relocation.component';
import { CodebookService } from './services/codebook.service';
import { EditorPagesComponent } from './components/editor/editor-pages/editor-pages.component';
import { EditorMetadataComponent } from './components/editor/editor-metadata/editor-metadata.component';
import { ViewerComponent } from './components/viewer/viewer.component';
import { DatetimePipe } from './pipes/datetime.pipe';
// import { DatePipe } from './pipes/date.pipe';
import { EditorLocationComponent } from './documents/document/editor-location/editor-location.component';
import { ModsEditorComponent } from './documents/document/mods-editor/mods-editor.component';
import { EditorAuthorComponent } from './documents/document/editor-author/editor-author.component';
import { EditorLanguageComponent } from './documents/document/editor-language/editor-language.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './components/app.component';
import { MaterialModule } from './modules/material.module';
import { XmlViewComponent } from './documents/document/mods-xml/xml-view.component';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
// import xml from 'highlight.js/lib/languages/xml';
import { EditorTitleComponent } from './documents/document/editor-title/editor-title.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorPublisherComponent } from './documents/document/editor-publisher/editor-publisher.component';
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
import { EditorSongComponent } from './components/editor/editor-song/editor-song.component';
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
import { AngularResizeEventModule } from 'angular-resize-event';
import { EditorPhysicalComponent } from './documents/document/editor-physical/editor-physical.component';
import { TreeComponent } from './components/search/tree/tree.component';
import { SearchService } from './services/search.service';
import { ImportService } from './services/import.service';
import { ImportTreeComponent } from './components/import-old/tree/tree.component';
import { IngestDialogComponent } from './dialogs/ingest-dialog/ingest-dialog.component';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';
import { PreferredTopsDialogComponent } from './dialogs/preferred-tops-dialog/preferred-tops-dialog.component';
import { EditorFieldComponent } from './documents/document/editor-field/editor-field.component';
import { EditorSubjectComponent } from './documents/document/editor-subject/editor-subject.component';
import { SongComponent } from './components/song/song.component';
import { EditorGenreComponent } from './documents/document/editor-genre/editor-genre.component';
import { EditorClassificationComponent } from './documents/document/editor-classification/editor-classification.component';
import { AutocompleteComponent } from './components/shared/autocomplete/autocomplete.component';
import { EditorResourceComponent } from './documents/document/editor-resource/editor-resource.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { SafePipe } from './pipes/safe.pipe';
import { FieldTextareaComponent } from './documents/document/field-textarea/field-textarea.component';
import { FieldDropdownComponent } from './documents/document/field-dropdown/field-dropdown.component';
import { FieldTextComponent } from './documents/document/field-text/field-text.component';
import { FieldCodebookComponent } from './documents/document/field-codebook/field-codebook.component';
import { UsageComponent } from './components/shared/usage/usage.component';
import { ChildrenValidationDialogComponent } from './dialogs/children-validation-dialog/children-validation-dialog.component';
import { ConvertDialogComponent } from './dialogs/convert-dialog/convert-dialog.component';
import { EditorPartComponent } from './documents/document/editor-part/editor-part.component';
import { EditorRecordInfoComponent } from './documents/document/editor-recordInfo/editor-recordInfo';
import { EditorTableOfContentsComponent } from './documents/document/editor-tableOfContents/editor-tableOfContents';
import { EditorRelatedItemComponent } from './documents/document/editor-relatedItem/editor-relatedItem.component';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import {EditorBdmComponent} from './components/editor/editor-bdm/editor-bdm.component';
import { NewMetadataDialogComponent } from './dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { AdminComponent } from './components/admin/admin.component';
import { ImportOldComponent } from './components/import-old/import-old.component';
import { NewWorkflowDialogComponent } from './components/workflow/new-workflow-dialog/new-workflow-dialog.component';
import { ChangeModelDialogComponent } from './dialogs/change-model-dialog/change-model-dialog.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { EditorGenericComponent } from './components/editor/editor-generic/editor-generic.component';
import { EditorStructureComponent } from './components/editor/editor-structure/editor-structure.component';
import { LayoutAdminComponent } from './pages/layout-admin/layout-admin.component';
import { BatchesComponent } from './pages/batches/batches.component';
import { FlexLayoutModule } from '@angular/flex-layout';


// export function hljsLanguages() {
//   return [
//     {name: 'xml', func: xml}
//   ];
// }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
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
    LoginComponent,
    DevicesComponent,
    DeviceComponent,
    EditDeviceComponent,
    SimpleDialogComponent,
    ImportDialogComponent,
    LogDialogComponent,
    SearchComponent,
    // DatePipe,
    DatetimePipe,
    ShortenPipe,
    AtmComponent,
    OcrComponent,
    NoteComponent,
    ViewerComponent,
    EditAudioDeviceComponent,
    EditorComponent,
    EditorChildrenComponent,
    EditorOcrComponent,
    EditorModsComponent,
    EditorCommentComponent,
    EditorAtmComponent,
    EditorPageComponent,
    EditorSongComponent,
    EditorMetadataComponent,
    EditorGeoComponent,
    EditorSubjectGeoComponent,
    EditorPagesComponent,
    EditorRelocationComponent,
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
    EditorBdmComponent,
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
    EditorRecordInfoComponent,
    EditorRelatedItemComponent,
    TreeComponent,
    ImportTreeComponent,
    IngestDialogComponent,
    AboutDialogComponent,
    PreferredTopsDialogComponent,
    EditorFieldComponent,
    EditorSubjectComponent,
    SongComponent,
    EditorGenreComponent,
    EditorClassificationComponent,
    AutocompleteComponent,
    EditorResourceComponent,
    PdfComponent,
    SafePipe,
    FieldTextComponent,
    FieldTextareaComponent,
    FieldDropdownComponent,
    FieldCodebookComponent,
    UsageComponent,
    ChildrenValidationDialogComponent,
    ConvertDialogComponent,
    EditorPartComponent,
    EditorTableOfContentsComponent,
    AlertDialogComponent,
    NewMetadataDialogComponent,
    WorkflowComponent,
    AdminComponent,
    ImportOldComponent,
    NewWorkflowDialogComponent,
    ChangeModelDialogComponent,
    RepositoryComponent,
    EditorGenericComponent,
    EditorStructureComponent,
    LayoutAdminComponent,
    BatchesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularResizeEventModule,
    AngularSplitModule.forRoot(),
    HighlightModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
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
    ConfigService,
    FundService,
    OsmService,
    SearchService,
    ImportService,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'cs-CZ' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        // lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml')
        },
        // themePath: 'path-to-theme.css' // Optional, and useful if you want to change the theme dynamically
      }
    }
  ],
  entryComponents: [
    AlertDialogComponent,
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
    PreferredTopsDialogComponent,
    ChildrenValidationDialogComponent,
    ConvertDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
