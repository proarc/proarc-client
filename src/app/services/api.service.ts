import { Folder } from './../model/folder.model';
import { CatalogueEntry } from './../model/catalogueEntry.model';
import { Catalogue } from '../model/catalogue.model';
import { Atm } from './../model/atm.model';
import { DocumentItem } from './../model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Device } from '../model/device.model';

import { map } from 'rxjs/operators';
import { Ocr } from '../model/ocr.model';
import { Note } from '../model/note.model';
import { Mods } from '../model/mods.model';
import { Page } from '../model/page.model';
import { Profile } from '../model/profile.model';
import { Batch } from '../model/batch.model';
import { User } from '../model/user.model';
import { ProArc } from '../utils/proarc';
import { Registrar } from '../model/registrar.model';
import { ConfigService } from './config.service';
import { PageUpdateHolder } from '../components/editor/editor-pages/editor-pages.component';
import { Workflow } from '../model/workflow.model';
import {AudioPage} from '../model/audioPage.model';
import {AudioPagesUpdateHolder} from '../components/editor/editor-audioPages/editor-audioPages.component';
import { Router } from '@angular/router';

@Injectable()
export class ApiService {

  constructor(
    private router: Router,
    private http: HttpClient, 
    private config: ConfigService) {
  }

  public getBaseUrl(): string {
    return this.config.proarcBackendUrl;
  }

  public getApiUrl(): string {
    return `${this.getBaseUrl()}/rest/v1/`
  }

  private get(path: string, params = {}): Observable<Object> {
    return this.http.get(encodeURI(`${this.getApiUrl()}${path}`), { params: params })
    .pipe(
      finalize(() => this.stopLoading())
    )
    .pipe(
      catchError(this.handleError)
      );
  }

  private head(path: string, params = {}): Observable<Object> {
    return this.http.head(encodeURI(`${this.getApiUrl()}${path}`), { params: params }).pipe(
      finalize(() => this.stopLoading())
    ).pipe(catchError(this.handleError));
  }



  private put(path: string, body: any, options: any = null): Observable<Object> {
    if (!options) {
      options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept-Language': 'cs'
        })
      };
    }
    return this.http.put(encodeURI(`${this.getApiUrl()}${path}`), body, options).pipe(
      finalize(() => this.stopLoading())
    ).pipe(catchError(this.handleError));
  }

  private post(path: string, body: any, options: any = null): Observable<Object> {
    if (!options) {
      options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
      };
    }
    return this.http.post(encodeURI(`${this.getApiUrl()}${path}`), body, options).pipe(
      finalize(() => this.stopLoading())
    ).pipe(catchError(this.handleError));;;
  }

  private delete(path: string, params = {}): Observable<Object> {
    return this.http.delete(encodeURI(`${this.getApiUrl()}${path}`), { params: params }).pipe(
      finalize(() => this.stopLoading())
    ).pipe(catchError(this.handleError));;
  }

  private request(method: string, path: string, params = {}, body: any): Observable<Object> {
    return this.http.request(method, encodeURI(`${this.getApiUrl()}${path}`), { params, body }).pipe(
      finalize(() => this.stopLoading())
    ).pipe(catchError(this.handleError));;
  }

  private handleError(error: HttpErrorResponse) {
    //  console.log(error);
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else if (error.status === 403) {
      // Forbiden. Redirect to login
      console.log("Forbiden");
      this.router.navigate(['/login']);
    } else {
      console.error(
         `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    // return throwError({'status':error.status, 'message': error.message});
    return of({response:{'status':error.status, 'message': error.message, 'errors': [error.error]}});
  }

  private cdkSpinnerCreate() {
    // return this.overlay.create({
    //   hasBackdrop: true,
    //   // backdropClass: 'dark-backdrop',
    //   positionStrategy: this.overlay.position()
    //     .global()
    //     .centerHorizontally()
    //     .centerVertically()
    // })
  }

  showLoading() {
    // this.numLoading++;
    // if (!this.spinnerTopRef.hasAttached()) {
    //   this.spinnerTopRef.attach(new ComponentPortal(MatSpinner))
    // }
  }

  stopLoading() {
    // this.numLoading--;
    // if (this.numLoading === 0 && this.spinnerTopRef.hasAttached()) {
    //   this.spinnerTopRef.detach();
    // }
  }


  registerUrnnbn(resolver: string, pid: string): Observable<any> {
    let data = `resolverId=${resolver}&pid=${pid}`;
    return this.post('object/urnnbn', data);
  }

  createObject(data: string): Observable<any> {
    return this.post('object', data);
  }

  copyObject(pid: string, model: string): Observable<any> {
    let data = `model=${model}`;
    if (pid) {
      data = `${data}&pid=${pid}`;
    }
    return this.post('object/copyObject', data);
  }

  export(type: string, pid: string, policy: string, ignoreMissingUrnNbn: boolean): Observable<any> | undefined {
    let data = `pid=${pid}`;
    if (ignoreMissingUrnNbn) {
      data = `${data}&ignoreMissingUrnNbn=true`;
    }
    let path = '';
    switch (type) {
      case ProArc.EXPORT_DATASTREAM_FULL: {
        data = `${data}&dsid=FULL`;
        path = 'export/datastream'
        break;
      }
      case ProArc.EXPORT_DATASTREAM_RAW: {
        data = `${data}&dsid=RAW`;
        path = 'export/datastream'
        break;
      }
      case ProArc.EXPORT_KRAMERIUS: {
        data = `${data}&policy=policy:${policy}`;
        path = 'export/kramerius4'
        break;
      }
      case ProArc.EXPORT_ARCHIVE: {
        path = 'export/archive'
        break;
      }
      case ProArc.EXPORT_ARCHIVE_OLDPRINT: {
        data = `${data}&package=STT`;
        path = 'export/archive'
        break;
      }
      case ProArc.EXPORT_NDK_PSP: {
        path = 'export/ndk'
        break;
      }
      case ProArc.EXPORT_CEJSH: {
        path = 'export/cejsh'
        break;
      }
      case ProArc.EXPORT_CROSSREF: {
        path = 'export/crossref'
        break;
      }
      case ProArc.EXPORT_KWIS: {
        data = `${data}&policy=policy:${policy}`;
        path = 'export/kwis'
        break;
      }
      default: return undefined;
    }
    return this.post(path, data);
  }

  getRegistrars(): Observable<any> {
    return this.get('urnnbn');
  }

  // getImportFolders(profile: Profile, folder: string = null): Observable<Folder[]> {
  //   return this.get('import/folder', { profile: profile.id, folder: folder})
  //       .pipe(map(response => Folder.fromJsonArray(response['response']['data'])));
  // }

  getImportFolders(folder: string | null = null): Observable<any> {
    return this.get('import/folder', { folder: folder});

  }

  getImportProfiles(): Observable<Profile[]> {
    return this.get('profile', { profileGroup: 'import.profiles' })
        .pipe(map((response: any) => Profile.fromJsonArray(response['response']['data'])));
  }

  setParent(srcParent: string, dstParent: string): Observable<any> {
    const data = `pid=${srcParent}&parent=${dstParent}`;
    return this.post('object/member', data);
  }

  deleteParent(pid: string, parent: string): Observable<any> {
    const query = `object/member?pid=${pid}&parent=${parent}`;
    return this.delete(query);
  }

  relocateObjects(srcParent: string, dstParent: string, pids: string[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const payload =
     {
      'srcPid': srcParent,
      'dstPid': dstParent,
      'pid': pids
    };
    return this.put('object/member/move', payload, httpOptions);
  }

  deleteObjects(pids: string[], purge: boolean, batchId: any = null): Observable<any> | null {
    let url = '';
    let body: any = {};
    //let query = pids.map(pid => `pid=${pid}`).join('&');
    if (batchId) {
      url = `import/batch/item`;
      body.batchId = batchId;
      body.pid = pids;
      //query = `import/batch/item?batchId=${batchId}&${query}`;
    } else {
      url = `object`;
      body.purge = purge;
      body.hierarchy = true;
      body.restore = false;
      body.pid = pids;
      // query = `object?purge=${purge}&hierarchy=true&${query}`;
    }
    //return this.delete(query);
    return this.request('delete', url, {}, body);

  }

  restoreObject(pid: string, hierarchy: boolean, purge: boolean): Observable<any> {
    const query = `object?restore=true&hierarchy=${hierarchy}&purge=${purge}&pid=${pid}`;
    return this.delete(query);
  }

  lockObjects(pids: string[], model: string): Observable<any> {
    const data = `pid=${pids}&model=${model}`;
    const path = `object/lockObject`;
    return this.post(path, data);
  }

  unlockObjects(pids: string[], model: string): Observable<any> {
    const data = `pid=${pids}&model=${model}`;
    const path = `object/unlockObject`;
    return this.post(path, data);
  }


  convertPages(pid: string, model: string, type: string) {
    const data = `pid=${pid}&model=${model}`;
    const path = `object/${type}`;
    return this.post(path, data);
  }

  changeModel(pid: string, model:string, path: string) {
    const data = `pid=${pid}&model=${model}`;
    return this.post(path, data);
  }

  updateObjects(pid: string, model:string) {
    const data = `pid=${pid}&model=${model}`;
    const path = `object/updateAllObjectsObjects`;
    return this.post(path, data);
  }


  reindexPages(parentPid: string, pagePid: string, batchId: any = null, model: string): Observable<any> {
    let data = `parent=${parentPid}&pid=${pagePid}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    if (model) {
      data = `${data}&model=${model}`;
    }
    return this.put('object/reindexObjects', data);
  }

  getPage(pid: string, model: string, batchId: any = null): Observable<Page> {
    const editorId = model == 'model:page' ? 'proarc.mods.PageForm' : model;
    const params: any = { pid: pid, editorId: editorId };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/mods/custom', params)
            .pipe(map((response: any) => Page.fromJson(response['response']['data'][0], model)));
  }

  getAudioPage(pid: string, model: string, batchId: any = null): Observable<AudioPage> {
    const editorId = model == 'model:page' ? 'proarc.mods.PageForm' : model;
    const params: any = { pid: pid, editorId: editorId };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/mods/custom', params)
            .pipe(map((response: any) => AudioPage.fromJson(response['response']['data'][0], model)));
  }

  editPage(page: Page, batchId: any = null): Observable<any> {
    const editorId = page.model == 'model:page' ? 'proarc.mods.PageForm' : page.model;
    let data = `pid=${page.pid}&editorId=${editorId}&jsonData=${JSON.stringify(page.toJson())}&timestamp=${page.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/mods/custom', data);
  }

  editAudioPage(audioPage: AudioPage, batchId: any = null): Observable<any> {
    const editorId = audioPage.model == 'model:page' ? 'proarc.mods.PageForm' : audioPage.model;
    let data = `pid=${audioPage.pid}&editorId=${editorId}&jsonData=${JSON.stringify(audioPage.toJson())}&timestamp=${audioPage.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/mods/custom', data);
  }

  getAtm(pid: string, batchId: any = null): Observable<Atm> {
    const params: any = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/atm', params).pipe(map((response: any) => Atm.fromJson(response['response']['data'][0])));
  }

  editAtm(atm: Atm, batchId: any = null): Observable<any> {
    let data = `pid=${atm.pid}&device=${atm.device}&status=${atm.status}&model=${atm.model}&userProcessor=${atm.userProcessor}&organization=${atm.organization}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/atm', data);
  }

  getMetadata(pid: string, model: string): Observable<any> {
    return this.get('object/mods/plain', { pid: pid });
  }

  getMods(pid: string, batchId: any = null): Observable<any> {
    const params: any = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/mods/plain', params);
  }

  editMetadata(document: Metadata, ignoreValidation: boolean): Observable<any> {
    return this.editModsXml(document.pid, document.toMods(), document.timestamp, ignoreValidation);
  }

  editMods(mods: Mods, ignoreValidation: boolean, batchId: any = null): Observable<Mods> {
    return this.editModsXml(mods.pid, mods.content, mods.timestamp, ignoreValidation, batchId).pipe(map(response => Mods.fromJson(response['data'][0])));
  }

  editModsXml(pid: string, xml: string, timestamp: number, ignoreValidation: boolean, batchId: any = null): Observable<any> {
    const xmlText = xml.replace(/&/g, '%26');
    let data = `pid=${pid}&ignoreValidation=${ignoreValidation}&xmlData=${xmlText}&timestamp=${timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    // return this.put('object/mods/custom', data).pipe(map(response => Mods.fromJson(response['response']['data'][0])));
    return this.put('object/mods/custom', data).pipe(map((response: any) => response['response']));
  }


  getOcr(pid: string, batchId: any = null): Observable<Ocr> {
    const params: any = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/ocr', params).pipe(map((response: any) =>
      Ocr.fromJson(response['record'])));
  }

  editOcr(ocr: Ocr, batchId: any = null): Observable<Ocr> {
    let data = `pid=${ocr.pid}&content=${ocr.content}&timestamp=${ocr.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/ocr', data).pipe(map((response: any) => Ocr.fromJson(response['record'])));
  }


  getNote(pid: string, batchId: any = null): Observable<Note> {
    const params: any = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/privatenote', params).pipe(map((response: any) =>
      Note.fromJson(response['record'])));
  }

  editNote(note: Note, batchId: any = null): Observable<Note> {
    let data = `pid=${note.pid}&content=${note.content}&timestamp=${note.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/privatenote', data).pipe(map((response: any) => Note.fromJson(response['record'])));
  }


  deletePdf(pid: string): Observable<any> {
    let query = `object/dissemination?pid=${pid}&datastream=RAW`;
    return this.delete(query);
  }

  uploadPdf(file: File, pid: string) {
    const formData: any = new FormData();
    formData.append('file', file);
    formData.append('mime', 'application/pdf');
    formData.append('pid', pid);
    return this.post('object/dissemination', formData, {});
  }

  getSearchResults(options: any = {}) { //model: string, query: string, queryField: string, page: number, sortField = 'lastCreated', sortAsc = false): Observable<[DocumentItem[], number]> {
    const params: any = {
      type: options['type'],
      _startRow: options['page'] * 100,
    };
    if (options['model'] !== 'all') {
      params['queryModel'] = options['model'];
    }



    if (options['type'] === 'phrase') {
      if (options['query']) {
        params['phrase'] = options['query'];
        params['type'] = 'phrase';
      } else {
        params['type'] = 'advanced';
      }
    } else {
      params['type'] = options['type'];
    }


    if (options['type'] !== 'phrase') {

      if (options['organization'] && options['organization'] != '-') {
        params['organization'] = options['organization'];
      }
      if (options['owner'] && options['owner'] != '-') {
        params['owner'] = options['owner'];
      }
      if (options['processor'] && options['processor'] != '-') {
        params['processor'] = options['processor'];
      }
      if (options['queryLabel'] && options['queryLabel'] != '') {
        params['queryLabel'] = options['queryLabel'];
      }

      if (options['queryIdentifier'] && options['queryIdentifier'] != '') {
        params['queryIdentifier'] = options['queryIdentifier'];
      }

      if (options['queryCreator'] && options['queryCreator'] != '-') {
        params['queryCreator'] = options['queryCreator'];
      }
    }

    params['sortField'] = options['sortField'] || '';
    if (options['sortAsc']) {
      params['_sort'] = 'asc';
    } else {
      params['_sort'] = 'desc';
    }
    return this.get('object/search', params).pipe(map((response: any) => [DocumentItem.fromJsonArray(response['response']['data']), response['response']['totalRows']] as [DocumentItem[], number]));
  }

  getDocument(pid: string): Observable<DocumentItem> {
    const params = {
      root: pid
    };
    return this.get('object/member', params).pipe(map((response: any) => DocumentItem.fromJson(response['response']['data'][0])));
  }

  getParent(pid: string): Observable<DocumentItem> {
    const params = {
      type: 'parent',
      pid: pid
    };
    return this.get('object/search', params).pipe(map((response: any) => DocumentItem.fromJson(response['response']['data'][0])));
  }

  getRelations(parent: string): Observable<DocumentItem[]> {
    const params = {
      root: parent,
      parent: parent
    };
    return this.get('object/member', params).pipe(map((response: any) => DocumentItem.fromJsonArray(response['response']['data'])));
  }

  getBatchPages(id: string): Observable<any> {
    return this.get('import/batch/item', { batchId: id });
  }

  getBatchPage(id: string, pid: string): Observable<any> {
    return this.get('import/batch/item', { batchId: id, pid: pid });
  }

  getCatalogs(): Observable<Catalogue[]> {
    return this.get('bibliographies').pipe(map((response: any) => Catalogue.fromJsonArray(response['response']['data'])));
  }

  getAuthorityCatalogs(): Observable<Catalogue[]> {
    return this.get('authorities').pipe(map((response: any) => Catalogue.fromJsonArray(response['response']['data'])));
  }

  getCatalogSearchResults(type: string, catalog: string, field: string, query: string): Observable<any> {
    const params: any = {
      catalog: catalog,
      fieldName: field,
      value: query
    };
    let resource = 'bibliographies';
    if (type == 'authors') {
      resource = 'authorities';
      params['type'] = 'ALL';
    }
    return this.get(`${resource}/query`, params);
  }

  getDevices(): Observable<Device[]> {
    return this.get('device').pipe(map((response: any) => Device.fromJsonArray(response['response']['data'])));
  }

  getDevice(deviceId: string): Observable<Device> {
    return this.get('device', { id: deviceId }).pipe(map((response: any) => Device.fromJson(response['response']['data'][0])));
  }

  removeDevice(deviceId: string): Observable<Device> {
    return this.delete('device', { id: deviceId }).pipe(map((response: any) => Device.fromJson(response['response']['data'][0])));
  }

  editDevice(device: Device): Observable<Device> {
    let data = `id=${device.id}&label=${device.label}&model=${device.model}&timestamp=${device.timestamp}&description=${device.description()}`;
    if (device.isAudio()) {
      data += `&audiotimestamp=${device.audiotimestamp}&audiodescription=${device.audioDescription()}`;
    }
    return this.put('device', data).pipe(map((response: any) => Device.fromJson(response['response']['data'][0])));
  }

  editPages(pages: string[], holder: PageUpdateHolder, batchId: any = null) {
    let data = `pids=${pages}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    if (holder.editType) {
      data += `&pageType=${holder.pageType}`;
    }
    if (holder.editIndex) {
      data += `&startIndex=${holder.pageIndex}`;
    }
    if (holder.useBrackets) {
      data += `&useBrackets=${holder.useBrackets}`;
    }
    if (holder.doubleColumns) {
      data += `&doubleColumns=${holder.doubleColumns}`;
    }
    if (holder.editNumber) {
      data += `&sequence=${holder.pageNumberNumbering.id}&prefix=${holder.pageNumberPrefix}&suffix=${holder.pageNumberSuffix}&startNumber=${holder.getPageIndexFrom()}&incrementNumber=${holder.pageNumberIncrement}`;
    }
    if (holder.applyTo > 1) {
      data += `&applyToFirstPage=${holder.applyToFirst}`;
    }
    if (holder.editPosition) {
      data += `&pagePosition=${holder.pagePosition}`;
    }
    data += `&applyTo=${holder.applyTo}`;
    return this.put('object/mods/editorPages', data);
  }

  editAudioPages(pages: string[], holder: AudioPagesUpdateHolder, batchId: any = null) {
    let data = `pids=${pages}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    if (holder.editIndex) {
      data += `&startIndex=${holder.pageIndex}`;
    }
    if (holder.applyTo > 1) {
      data += `&applyToFirstPage=${holder.applyToFirst}`;
    }
    data += `&applyTo=${holder.applyTo}`;
    return this.put('object/mods/editorPages', data);
  }

  editBrackets(pages: string[], holder: PageUpdateHolder, useBrackets: boolean, batchId: any = null) {
    const action = useBrackets ? 'addBrackets' : 'removeBrackets';
    let data = `pids=${pages}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    data += `&applyTo=${holder.applyTo}`;
    return this.post('object/mods/' + action, data);
  }


  editRelations(parentPid: string, pidArray: string[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const payload = {
      'parent': parentPid,
      'pid': pidArray
    };
    return this.put('object/member', payload, httpOptions);
  }

  editBatchRelations(batchId: string, pidArray: string[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const payload = {
      'batchId': batchId,
      'pid': pidArray
    };
    return this.put('object/member', payload, httpOptions);
  }

  createDevice(model: string): Observable<Device> {
    const data = `model=${model}`;
    return this.post('device', data).pipe(map((response: any) => Device.fromJson(response['response']['data'][0])));
  }

  setParentForBatch(id: number, parent: string): Observable<Batch> {
    const data = `id=${id}&parentPid=${parent}`;
    return this.put('import/batch', data).pipe(map((response: any) => Batch.fromJson(response['response']['data'][0])));
  }

  ingestBatch(id: number, parent: string): Observable<any> {
    let data = `id=${id}&state=INGESTING`;
    if (parent) {
      data += `&parentPid=${parent}`;
    }
    return this.put('import/batch', data);
  }

  stopBatch(id: number): Observable<any> {
    let data = `id=${id}`;
    return this.post('import/batchStopped', data);
  }

  reloadBatch(id: number, profile: string): Observable<Batch> {
    const data = `id=${id}&profile=${profile}&state=LOADING_FAILED`;
    return this.put('import/batch', data).pipe(map((response: any) => Batch.fromJson(response['response']['data'][0])));
  }

  createImportBatch(path: string, profile: string, indices: boolean, device: string, priority:string): Observable<any> {
    const data = `folderPath=${path}&profile=${profile}&indices=${indices}&device=${device}&priority=${priority}`;
    return this.post('import/batch', data);
  }

  reReadFolder(path: string): Observable<any> {
    const data = `folderPath=${path}&_textMatchStyle=exact&isc_dataFormat=json`;
    return this.post('import/batch/unlockFolder', data);
  }

  createImportBatches(paths: string[], profile: string, indices: boolean, device: string) {
    const data = `folderPath=[${paths}]&profile=${profile}&indices=${indices}&device=${device}`;
    return this.post('import/batches', data);//.pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  getImportBatchStatusOld(id: number): Observable<any> {
    return this.get('import/batch/item', { batchId: id });
  }

  getImportBatchStatus(id: number): Observable<any> {
    return this.get('import/batch?id='+id, { batchId: id });
  }

  getImportBatches(params: any): Observable<any> {
    return this.get('import/batch', params)
    // .pipe(map((response: any) => Batch.fromJsonArray(response['response']['data'])));
    .pipe(map((response: any) => response['response']));
  }


  getInfo(): Observable<any> {
    return this.get('info', {})
            .pipe(map((response: any) => response['response']['data'][0]));
  }


  getBatchQueue(): Observable<Batch[]> {
    return this.get('import/processingBatches', {})
            .pipe(map((response: any) => Batch.fromJsonArray(response['response']['data'])));
  }

  getImportBatch(id: number): Observable<any> {
    return this.get('import/batch', { id: id })
     .pipe(map((response: any) => Batch.fromJson(response['response']['data'][0])));
  }

  getWorkflow(): Observable<any> {
    return this.get('workflow');
  }

  getWorkflowProfiles(): Observable<any> {
    return this.get('workflow/profile');
  }

  getWorkflowItem(id: number): Observable<any> {
    return this.get('workflow?id='+id);
  }

  saveWorkflowItem(w: Workflow): Observable<any> {
    // const body = new HttpParams({fromObject: w})
    let httpParams = new HttpParams();
    Object.keys(w).forEach(key => {
      const value = (w as any)[key];
      httpParams = httpParams.set(key, value+'');
    });
    return this.put('workflow', httpParams);
  }

  createWorkflow(data: string): Observable<any> {
    return this.post('workflow', data);
  }

  getWorkflowMaterial(id: number): Observable<any> {
    return this.get('workflow/material?jobId='+id);
  }

  getWorkflowTask(id: number): Observable<any> {
    return this.get('workflow/task?jobId='+id);
  }

  getUsers(): Observable<User[]> {
    return this.get('user')
            .pipe(map((response: any) => User.fromJsonArray(response['response']['data'])));
  }

  getUser(): Observable<User> {
    return this.get('user?whoAmI=true')
            .pipe(map((response: any) => User.fromJson(response['response']['data'][0])));
  }

  editUser(user: User, forename: string, surname: string): Observable<User> {
    const data = `userId=${user.userId}&forename=${forename}&surname=${surname}&email=${user.email}&organization=${user.organization}&role=${user.role}`;
    return this.put('user', data).pipe(map((response: any) => User.fromJson(response['response']['data'][0])));
  }

  saveUser(user: User): Observable<User> {
    let data = `userId=${user.userId}&surname=${user.surname}&role=${user.role}`;
    if (user.password) {
      data = `${data}&password=${user.password}`;
    }
    if (user.forename) {
      data = `${data}&forename=${user.forename}`;
    }
    if (user.email) {
      data = `${data}&email=${user.email}`;
    }
    if (user.organization) {
      data = `${data}&organization=${user.organization}`;
    }

    data = `${data}&changeModelFunction=${user.changeModelFunction}&updateModelFunction=${user.updateModelFunction}`;
    data = `${data}&unlockObjectFunction=${user.unlockObjectFunction}&lockObjectFunction=${user.lockObjectFunction}`;
    return this.put('user', data).pipe(map((response: any) => User.fromJson(response['response']['data'][0])));
  }

  newUser(user: User): Observable<any> {
    let data = `name=${user.name}&surname=${user.surname}&role=${user.role}&password=${user.password}`;
    if (user.forename) {
      data = `${data}&forename=${user.forename}`;
    }
    if (user.email) {
      data = `${data}&email=${user.email}`;
    }
    if (user.organization) {
      data = `${data}&organization=${user.organization}`;
    }
    data = `${data}&changeModelFunction=${user.changeModelFunction}&updateModelFunction=${user.updateModelFunction}`;
    data = `${data}&unlockObjectFunction=${user.unlockObjectFunction}&lockObjectFunction=${user.lockObjectFunction}`;
    return this.post('user', data);
  }

  deleteUser(user: User): Observable<any> {
    let data = `user?userId=${user.userId}`;
    return this.delete(data);
  }

  editUserPassword(user: User, password: string): Observable<any> {
    const data = `userId=${user.userId}&forename=${user.forename}&surname=${user.surname}&email=${user.email}&organization=${user.organization}&role=${user.role}&password=${password}`;
    return this.put('user', data)
  }

  getThumbUrl(pid: string) {
    return this.getStreamUrl(pid, 'THUMBNAIL');
  }

  getStreamUrl(pid: string, stream: string, batchId: any = null) {
    let url = `${this.getApiUrl()}object/dissemination?pid=${pid}&datastream=${stream}`
    if (batchId) {
      url = `${url}&batchId=${batchId}`;
    }
    return url;
  }

  headStream(pid: string, stream: string) {
    let path = `object/dissemination?pid=${pid}&datastream=${stream}`
    return this.head(path);
  }

  

  saveMarkSequence(data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    };
    return this.post('object/mods/editorPagesCopyMetadata', data, options);
  }


}

