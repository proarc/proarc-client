
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
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';

import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './components/app.component';
import { XmlViewComponent } from './documents/document/mods-xml/xml-view.component';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
// import xml from 'highlight.js/lib/languages/xml';
import { EditorTitleComponent } from './documents/document/editor-title/editor-title.component';
import { EditorPublisherComponent } from './documents/document/editor-publisher/editor-publisher.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { EditorIdentifierComponent } from './documents/document/editor-identifier/editor-identifier.component';
import { EditorNoteComponent } from './documents/document/editor-note/editor-note.component';
import { RelationsComponent } from './documents/relations/relations.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { DeviceComponent } from './pages/devices/device/device.component';
import { EditDeviceComponent } from './pages/devices/edit-device/edit-device.component';
import { UIService } from './services/ui.service';
import { SimpleDialogComponent } from './dialogs/simple-dialog/simple-dialog.component';
import { SearchComponent } from './pages/search/search.component';
import { AtmComponent } from './components/atm/atm.component';
import { OcrComponent } from './components/ocr/ocr.component';
import { NoteComponent } from './components/note/note.component';
import { EditAudioDeviceComponent } from './pages/devices/edit-audio-device/edit-audio-device.component';
import { LocalStorageService } from './services/local-storage.service';
import { EditorOcrComponent } from './components/editor/editor-ocr/editor-ocr.component';
import { EditorModsComponent } from './components/editor/editor-mods/editor-mods.component';
import { EditorCommentComponent } from './components/editor/editor-comment/editor-comment.component';
import { EditorAtmComponent } from './components/editor/editor-atm/editor-atm.component';
import { EditorPageComponent } from './components/editor/editor-page/editor-page.component';
import { EditorAudioPageComponent } from './components/editor/editor-audioPage/editor-audioPage.component';
import { ImportComponent } from './pages/import/import.component';
import { ImportDialogComponent } from './dialogs/import-dialog/import-dialog.component';
import { ProcessManagementComponent } from './pages/process-management/process-management.component';
import { LogDialogComponent } from './dialogs/log-dialog/log-dialog.component';
import { NewObjectDialogComponent } from './dialogs/new-object-dialog/new-object-dialog.component';
import { CatalogDialogComponent } from './dialogs/catalog-dialog/catalog-dialog.component';
import { ParentDialogComponent } from './dialogs/parent-dialog/parent-dialog.component';
import { CuzkService } from './services/cuzk.service';
import { ExportDialogComponent } from './dialogs/export-dialog/export-dialog.component';
import { UrnnbnDialogComponent } from './dialogs/urnnbn-dialog/urnnbn-dialog.component';
import { ShortenPipe } from './pipes/shorten.pipe';
import { HelpDialogComponent } from './dialogs/help-dialog/help-dialog.component';
import { ReloadBatchDialogComponent } from './dialogs/reload-batch-dialog/reload-batch-dialog.component';
import { ConfigService } from './services/config.service';
import { EditorChronicleLocationComponent } from './documents/document/editor-chronicle-location/editor-chronicle-location.component';
import { FundService } from './services/fund.service';
import { FundDialogComponent } from './dialogs/fund-dialog/fund-dialog.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NewPasswordDialogComponent } from './dialogs/new-password-dialog/new-password-dialog.component';
import { EditorAbstractComponent } from './documents/document/editor-abstract/editor-abstract.component';
import { EditorPhysicalComponent } from './documents/document/editor-physical/editor-physical.component';
import { TreeComponent } from './pages/search/tree/tree.component';
import { SearchService } from './services/search.service';
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
import { NewMetadataDialogComponent } from './dialogs/new-metadata-dialog/new-metadata-dialog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ChangeModelDialogComponent } from './dialogs/change-model-dialog/change-model-dialog.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { EditorGenericComponent } from './components/editor/editor-generic/editor-generic.component';
import { EditorStructureComponent } from './components/editor/editor-structure/editor-structure.component';
import { LayoutAdminComponent } from './dialogs/layout-admin/layout-admin.component';
import { BatchesComponent } from './pages/batches/batches.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditorAesComponent } from './components/editor/editor-aes/editor-aes.component';
import {EditorAudioPagesComponent} from './components/editor/editor-audioPages/editor-audioPages.component';
import { FooterComponent } from './components/footer/footer.component';
import { EditorTreeComponent } from './components/editor/editor-tree/editor-tree.component';
import { MarkSequenceDialogComponent } from './dialogs/mark-sequence-dialog/mark-sequence-dialog.component';
import { EditorPremisComponent } from './components/editor/editor-premis/editor-premis.component';
import { KrameriusComponent } from './pages/kramerius/kramerius.component';
import { MetadataComponent } from './pages/kramerius/metadata/metadata.component';
import { KrameriusModsComponent } from './pages/kramerius/kramerius-mods/kramerius-mods.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MediaComponent } from './components/media/media.component';
import { SharedModule } from './shared.module';
import { EditorPremisMultipleComponent } from './components/editor/editor-premis-multiple/editor-premis-multiple.component';
import { EpubComponent } from './components/epub/epub.component';
import { EditUserComponent } from './pages/admin/edit-user/edit-user.component';
import { NewUserComponent } from './pages/admin/new-user/new-user.component';
import { EditorSwitcherComponent } from './components/editor/editor-switcher/editor-switcher.component';
import { ColumnsSettingsDialogComponent } from './dialogs/columns-settings-dialog/columns-settings-dialog.component';
import { TotestComponent } from './pages/totest/totest.component';
import { CzidloDialogComponent } from './dialogs/czidlo-dialog/czidlo-dialog.component';
import { UpdateInSourceDialogComponent } from './dialogs/update-in-source-dialog/update-in-source-dialog.component';
import { ResolveConflictDialogComponent } from './dialogs/resolve-conflict-dialog/resolve-conflict-dialog.component';
import { ChangeOwnerDialogComponent } from './pages/admin/change-owner-dialog/change-owner-dialog.component';
import { EditorAccessConditionComponent } from './documents/document/editor-accessCondition/editor-accessCondition.component';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 300,
  hideDelay: 10,
  touchendHideDelay: 10,
  position: 'above',
  disableTooltipInteractivity: true
};

// export function hljsLanguages() {
//   return [
//     {name: 'xml', func: xml}
//   ];
// }

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + Date.now());
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
    EditorAccessConditionComponent,
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
    EditorOcrComponent,
    EditorModsComponent,
    EditorCommentComponent,
    EditorAtmComponent,
    EditorPageComponent,
    EditorAudioPageComponent,
    EditorMetadataComponent,
    EditorPagesComponent,
    EditorAudioPagesComponent,
    ImportComponent,
    ProcessManagementComponent,
    NewObjectDialogComponent,
    CatalogDialogComponent,
    ParentDialogComponent,
    ExportDialogComponent,
    UrnnbnDialogComponent,
    HelpDialogComponent,
    ReloadBatchDialogComponent,
    EditorChronicleLocationComponent,
    FundDialogComponent,
    SettingsComponent,
    NewPasswordDialogComponent,
    EditorAbstractComponent,
    EditorPhysicalComponent,
    EditorRecordInfoComponent,
    EditorRelatedItemComponent,
    EditorAesComponent,
    TreeComponent,
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
    AdminComponent,
    ChangeModelDialogComponent,
    RepositoryComponent,
    EditorGenericComponent,
    EditorStructureComponent,
    LayoutAdminComponent,
    BatchesComponent,
    FooterComponent,
    EditorTreeComponent,
    MarkSequenceDialogComponent,
    EditorPremisComponent,
    KrameriusComponent,
    MetadataComponent,
    KrameriusModsComponent,
    MediaComponent,
    EditorPremisMultipleComponent,
    EpubComponent,
    EditUserComponent,
    NewUserComponent,
    EditorSwitcherComponent,
    ColumnsSettingsDialogComponent,
    TotestComponent,
    CzidloDialogComponent,
    UpdateInSourceDialogComponent,
    ResolveConflictDialogComponent,
    ChangeOwnerDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    HighlightModule,
    FlexLayoutModule,
    NgxExtendedPdfViewerModule ,
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
    LocalStorageService,
    CodebookService,
    CuzkService,
    ConfigService,
    FundService,
    SearchService,
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
    },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
    { provide: APP_INITIALIZER, useFactory: (config: AuthService) => () => config.initializeApp(), deps: [AuthService], multi: true },
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
