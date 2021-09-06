import { Folder } from './../model/folder.model';
import { CatalogueEntry } from './../model/catalogueEntry.model';
import { Catalogue } from '../model/catalogue.model';
import { Atm } from './../model/atm.model';
import { DocumentItem } from './../model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  public getBaseUrl(): string {
    return this.config.proarcBackendUrl;
  }

  public getApiUrl(): string {
    return `${this.getBaseUrl()}/rest/v1/`
  }

  private get(path: string, params = {}): Observable<Object> {
    return this.http.get(encodeURI(`${this.getApiUrl()}${path}`), { params: params });
  }

  private head(path: string, params = {}): Observable<Object> {
    return this.http.head(encodeURI(`${this.getApiUrl()}${path}`), { params: params });
  }



  private put(path: string, body: any, options = null): Observable<Object> {
    if (!options) {
      options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
      };
    }
    return this.http.put(encodeURI(`${this.getApiUrl()}${path}`), body, options);
  }

  private post(path: string, body: any, options = null): Observable<Object> {
    if (!options) {
      options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
      };
    }
    return this.http.post(encodeURI(`${this.getApiUrl()}${path}`), body, options);
  }

  private delete(path: string, params = {}): Observable<Object> {
    return this.http.delete(encodeURI(`${this.getApiUrl()}${path}`), { params: params });
  }


  registerUrnnbn(resolver: string, pid: string): Observable<any> {
    let data = `resolverID=${resolver}&pid=${pid}`;
    return this.post('object/urnnbn', data).pipe(map(response => response['response']['data'][0]));
  }

  createObject(model: string, pid: string, parentPid: string): Observable<string> {
    let data = `model=${model}`;
    if (pid) {
      data = `${data}&pid=${pid}`;
    }
    if (parentPid) {
      data = `${data}&parent=${parentPid}`;
    }
    return this.post('object', data).pipe(map(response => response['response']['data'][0]['pid']));
  }

  export(type: string, pid: string, policy: string): Observable<any> {
    let data = `pid=${pid}`;;
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
      default: return;
    }
    return this.post(path, data).pipe(map(response => response['response']['data']));
  }

  getRegistrars(): Observable<Registrar[]> {
    return this.get('urnnbn').pipe(map(response => Registrar.fromJsonArray(response['response']['data'])));
  }

  // getImportFolders(profile: Profile, folder: string = null): Observable<Folder[]> {
  //   return this.get('import/folder', { profile: profile.id, folder: folder})
  //       .pipe(map(response => Folder.fromJsonArray(response['response']['data'])));
  // }

  getImportFolders(folder: string = null): Observable<Folder[]> {
    return this.get('import/folder', { folder: folder})
        .pipe(map(response => Folder.fromJsonArray(response['response']['data'])));
  }

  getImportProfiles(): Observable<Profile[]> {
    return this.get('profile', { profileGroup: 'import.profiles' })
        .pipe(map(response => Profile.fromJsonArray(response['response']['data'])));
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

  deleteObjects(pids: string[], purge: boolean, batchId = null): Observable<string[]> | null {
    let query = pids.map(pid => `pid=${pid}`).join('&');
    if (batchId) {
      query = `import/batch/item?batchId=${batchId}&${query}`;
    } else {
      query = `object?purge=${purge}&hierarchy=true&${query}`;
    }
    return this.delete(query)
            .pipe(map(response => response['response']['data'].map(x => x.pid)));
  }


  reindexPages(parentPid: string, pagePid: string, batchId = null): Observable<any> {
    let data = `parent=${parentPid}&pid=${pagePid}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/reindexObjects', data);
  }

  getPage(pid: string, model: string, batchId = null): Observable<Page> {    
    const editorId = model == 'model:page' ? 'proarc.mods.PageForm' : model;
    const params = { pid: pid, editorId: editorId };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/mods/custom', params)
            .pipe(map(response => Page.fromJson(response['response']['data'][0], model)));
  }

  editPage(page: Page, batchId = null): Observable<Page> {
    const editorId = page.model == 'model:page' ? 'proarc.mods.PageForm' : page.model;
    let data = `pid=${page.pid}&editorId=${editorId}&jsonData=${JSON.stringify(page.toJson())}&timestamp=${page.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/mods/custom', data).pipe(map(response => Page.fromJson(response['response']['data'][0], page.model)));
  }

  getAtm(pid: string, batchId = null): Observable<Atm> {
    const params = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/atm', params).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  editAtm(atm: Atm, batchId = null): Observable<Atm> {
    let data = `pid=${atm.pid}&device=${atm.device}&status=${atm.status}&model=${atm.model}&userProcessor=${atm.userProcessor}&organization=${atm.organization}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/atm', data).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  getMetadata(pid: string, model: string): Observable<Metadata> {
    return this.get('object/mods/plain', { pid: pid }).pipe(map(response =>
      new Metadata(pid, model, response['record']['content'], response['record']['timestamp'])));
  }

  getMods(pid: string, batchId = null): Observable<Mods> {
    const params = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/mods/plain', params).pipe(map(response =>
      Mods.fromJson(response['record'])));
  }

  editMetadata(document: Metadata): Observable<any> {
    return this.editModsXml(document.pid, document.toMods(), document.timestamp);
  }

  editMods(mods: Mods, batchId = null): Observable<Mods> {
    return this.editModsXml(mods.pid, mods.content, mods.timestamp, batchId);
  }

  editModsXml(pid: string, xml: string, timestamp: number, batchId = null): Observable<Mods> {
    let data = `pid=${pid}&ignoreValidation=true&xmlData=${xml}&timestamp=${timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/mods/custom', data).pipe(map(response => Mods.fromJson(response['response']['data'][0])));
  }


  getOcr(pid: string, batchId = null): Observable<Ocr> {
    const params = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/ocr', params).pipe(map(response =>
      Ocr.fromJson(response['record'])));
  }

  editOcr(ocr: Ocr, batchId = null): Observable<Ocr> {
    let data = `pid=${ocr.pid}&content=${ocr.content}&timestamp=${ocr.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/ocr', data).pipe(map(response => Ocr.fromJson(response['record'])));
  }


  getNote(pid: string, batchId = null): Observable<Note> {
    const params = { pid: pid };
    if (batchId) {
      params['batchId'] = batchId;
    }
    return this.get('object/privatenote', params).pipe(map(response =>
      Note.fromJson(response['record'])));
  }

  editNote(note: Note, batchId = null): Observable<Note> {
    let data = `pid=${note.pid}&content=${note.content}&timestamp=${note.timestamp}`;
    if (batchId) {
      data = `${data}&batchId=${batchId}`;
    }
    return this.put('object/privatenote', data).pipe(map(response => Note.fromJson(response['record'])));
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

  getSearchResults(options = {}) { //model: string, query: string, queryFiled: string, page: number, sortField = 'lastCreated', sortAsc = false): Observable<[DocumentItem[], number]> {
    const params = {
      type: 'advanced',
      _startRow: options['page'] * 100,
    };
    if (options['model'] !== 'all') {
      params['queryModel'] = options['model'];
    }
    if (options['organization'] && options['organization'] != '-') {
      params['organization'] = options['organization'];
    }
    if (options['organization'] && options['organization'] != '-') {
      params['organization'] = options['organization'];
    }
    if (options['queryCreator'] && options['queryCreator'] != '-') {
      params['queryCreator'] = options['queryCreator'];
    }
    if (options['owner'] && options['owner'] != '-') {
      params['owner'] = options['owner'];
    }
    if (options['processor'] && options['processor'] != '-') {
      params['processor'] = options['processor'];
    }
    params['sortField'] = options['sortField'] || '';
    if (options['query']) {
      params[options['queryField']] = options['query'];
    } 
    if (options['sortAsc']) {
      params['_sort'] = 'asc';
    } else {
      params['_sort'] = 'desc';
    }
    return this.get('object/search', params).pipe(map(response => [DocumentItem.fromJsonArray(response['response']['data']), response['response']['totalRows']] as [DocumentItem[], number]));
  }

  getDocument(pid: string): Observable<DocumentItem> {
    const params = {
      root: pid
    };
    return this.get('object/member', params).pipe(map(response => DocumentItem.fromJson(response['response']['data'][0])));
  }

  getParent(pid: string): Observable<DocumentItem> {
    const params = {
      type: 'parent',
      pid: pid
    };
    return this.get('object/search', params).pipe(map(response => DocumentItem.fromJson(response['response']['data'][0])));
  }

  getRelations(parent: string): Observable<DocumentItem[]> {
    const params = {
      root: parent,
      parent: parent
    };
    return this.get('object/member', params).pipe(map(response => DocumentItem.fromJsonArray(response['response']['data'])));
  }

  getBatchPages(id: string): Observable<DocumentItem[]> {
    return this.get('import/batch/item', { batchId: id })
            .pipe(map(response => DocumentItem.pagesFromJsonArray(response['response']['data'])));
  }

  getCatalogs(): Observable<Catalogue[]> {
    return this.get('bibliographies').pipe(map(response => Catalogue.fromJsonArray(response['response']['data'])));
  }

  getAuthorityCatalogs(): Observable<Catalogue[]> {
    return this.get('authorities').pipe(map(response => Catalogue.fromJsonArray(response['response']['data'])));
  }

  getCatalogSearchResults(type: string, catalog: string, field: string, query: string): Observable<CatalogueEntry[]> {
    const params = {
      catalog: catalog,
      fieldName: field,
      value: query
    };
    let resource = 'bibliographies';
    if (type == 'authors') {
      resource = 'authorities';
      params['type'] = 'ALL';
    }
    return this.get(`${resource}/query`, params).pipe(map(response =>
      CatalogueEntry.fromJsonArray(response['metadataCatalogEntries']['entry'])));
  }

  getDevices(): Observable<Device[]> {
    return this.get('device').pipe(map(response => Device.fromJsonArray(response['response']['data'])));
  }

  getDevice(deviceId: string): Observable<Device> {
    return this.get('device', { id: deviceId }).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }

  removeDevice(deviceId: string): Observable<Device> {
    return this.delete('device', { id: deviceId }).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }

  editDevice(device: Device): Observable<Device> {
    let data = `id=${device.id}&label=${device.label}&model=${device.model}&timestamp=${device.timestamp}&description=${device.description()}`;
    if (device.isAudio()) {
      data += `&audiotimestamp=${device.audiotimestamp}&audiodescription=${device.audioDescription()}`;
    }
    return this.put('device', data).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }




  editPages(pages: string[], holder: PageUpdateHolder, batchId = null) {
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
    if (holder.editNumber) {
      data += `&sequence=${holder.pageNumberNumbering.id}&prefix=${holder.pageNumberPrefix}&suffix=${holder.pageNumberSuffix}&startNumber=${holder.getPageIndexFrom()}&incrementNumber=${holder.pageNumberIncrement}`;
    }
    if (holder.applyTo > 1) {
      data += `&applyToFirstPage=${holder.applyToFirst}`;
    }
    data += `&applyTo=${holder.applyTo}`;
    return this.put('object/mods/editorPages', data);
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
    return this.post('device', data).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }

  setParentForBatch(id: number, parent: string): Observable<Batch> {
    const data = `id=${id}&parentPid=${parent}`;
    return this.put('import/batch', data).pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  ingestBatch(id: number, parent: string): Observable<Batch> {
    let data = `id=${id}&state=INGESTING`;
    if (parent) {
      data += `&parentPid=${parent}`;
    }
    return this.put('import/batch', data).pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  reloadBatch(id: number, profile: string): Observable<Batch> {
    const data = `id=${id}&profile=${profile}&state=LOADING_FAILED`;
    return this.put('import/batch', data).pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  createImportBatch(path: string, profile: string, indices: boolean, device: string): Observable<Batch> {
    const data = `folderPath=${path}&profile=${profile}&indices=${indices}&device=${device}`;
    return this.post('import/batch', data).pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  createImportBatches(paths: string[], profile: string, indices: boolean, device: string) {
    const data = `folderPath=[${paths}]&profile=${profile}&indices=${indices}&device=${device}`;
    return this.post('import/batches', data);//.pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  getImportBatchStatus(id: number): Observable<[number, number]> {
    return this.get('import/batch/item', { batchId: id })
            .pipe(map(response => Batch.statusFromJson(response['response'])));
  }

  getImportBatches(state: string): Observable<Batch[]> {
    let params = {
      'sortBy': 'timestamp'
    };
    if (state && state !== 'ALL') {
      params['state'] = state;
    }

    return this.get('import/batch', params)
            .pipe(map(response => Batch.fromJsonArray(response['response']['data'])));
  }


  getInfo(): Observable<any> {
    return this.get('info', {})
            .pipe(map(response => response['response']['data'][0]));
  }


  getBatchQueue(): Observable<Batch[]> {
    return this.get('import/processingBatches', {})
            .pipe(map(response => Batch.fromJsonArray(response['response']['data'])));
  }

  getImportBatch(id: number): Observable<Batch> {
    return this.get('import/batch', { id: id })
            .pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  getUsers(): Observable<User[]> {
    return this.get('user')
            .pipe(map(response => User.fromJsonArray(response['response']['data'])));
  }

  getUser(): Observable<User> {
    return this.get('user?whoAmI=true')
            .pipe(map(response => User.fromJson(response['response']['data'][0])));
  }

  editUser(user: User, forename: string, surname: string): Observable<User> {
    const data = `userId=${user.userId}&forename=${forename}&surname=${surname}&email=${user.email}&organization=${user.organization}&role=${user.role}`;
    return this.put('user', data).pipe(map(response => User.fromJson(response['response']['data'][0])));
  }

  editUserPassword(user: User, password: string): Observable<any> {
    const data = `userId=${user.userId}&forename=${user.forename}&surname=${user.surname}&email=${user.email}&organization=${user.organization}&role=${user.role}&password=${password}`;
    return this.put('user', data)
  }

  getThumbUrl(pid: string) {
    return this.getStreamUrl(pid, 'THUMBNAIL');
  }

  getStreamUrl(pid: string, stream: string, batchId = null) {
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



}

