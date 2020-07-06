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
    return this.post('object/urnnbn', data); //.pipe(map(response => response['response']['data'][0]['pid']));
  }

  createObject(model: string, pid: string): Observable<string> {
    let data = `model=${model}`;
    if (pid) {
      data = `${data}&pid=${pid}`;
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

  getImportFolders(profile: Profile, folder: string = null): Observable<Folder[]> {
    return this.get('import/folder', { profile: profile.id, folder: folder})
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

  deleteObjects(pids: string[], purge: boolean): Observable<string[]> | null {
    console.log('pids', pids);
    const pidsQuery = pids.map(pid => `pid=${pid}`).join('&');
    const query = `purge=${purge}&hierarchy=trye&${pidsQuery}`;
    console.log('query', query);
    // return null;
    return this.delete(`object?${query}`)
            .pipe(map(response => response['response']['data'].map(x => x.pid)));
  }


  getPage(pid: string): Observable<Page> {
    return this.get('object/mods/custom', { pid: pid, editorId: 'proarc.mods.PageForm' })
            .pipe(map(response => Page.fromJson(response['response']['data'][0])));
  }

  editPage(page: Page): Observable<Page> {
    const data = `pid=${page.pid}&editorId=proarc.mods.PageForm&jsonData=${JSON.stringify(page.toJson())}&timestamp=${page.timestamp}`;
    return this.put('object/mods/custom', data).pipe(map(response => Page.fromJson(response['response']['data'][0])));
  }

  getAtm(id: string): Observable<Atm> {
    return this.get('object/atm', { pid: id }).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  editAtm(atm: Atm): Observable<Atm> {
    const data = `pid=${atm.pid}&device=${atm.device}&status=${atm.status}&userProcessor=${atm.userProcessor}&organization=${atm.organization}`;
    return this.put('object/atm', data).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  getMetadata(pid: string, model: string): Observable<Metadata> {
    return this.get('object/mods/plain', { pid: pid }).pipe(map(response =>
      new Metadata(pid, model, response['record']['content'], response['record']['timestamp'])));
  }

  getMods(pid: string): Observable<Mods> {
    return this.get('object/mods/plain', { pid: pid }).pipe(map(response =>
      Mods.fromJson(response['record'])));
  }

  editMetadata(document: Metadata): Observable<any> {
    return this.editModsXml(document.pid, document.toMods(), document.timestamp);
  }

  editMods(mods: Mods): Observable<Mods> {
    return this.editModsXml(mods.pid, mods.content, mods.timestamp);

  }

  editModsXml(pid: string, xml: string, timestamp: number): Observable<Mods> {
    const data = `pid=${pid}&ignoreValidation=true&xmlData=${xml}&timestamp=${timestamp}`;
    return this.put('object/mods/custom', data).pipe(map(response => Mods.fromJson(response['response']['data'][0])));
  }


  getOcr(id: string): Observable<Ocr> {
    return this.get('object/ocr', { pid: id }).pipe(map(response =>
      Ocr.fromJson(response['record'])));
  }

  editOcr(ocr: Ocr): Observable<Ocr> {
    const data = `pid=${ocr.pid}&content=${ocr.content}&timestamp=${ocr.timestamp}`;
    return this.put('object/ocr', data).pipe(map(response => Ocr.fromJson(response['record'])));
  }


  getNote(id: string): Observable<Note> {
    return this.get('object/privatenote', { pid: id }).pipe(map(response =>
      Note.fromJson(response['record'])));
  }

  editNote(note: Note): Observable<Note> {
    const data = `pid=${note.pid}&content=${note.content}&timestamp=${note.timestamp}`;
    return this.put('object/privatenote', data).pipe(map(response => Note.fromJson(response['record'])));
  }

  getSearchResults(model: string, query: string, queryFiled: string, page: number, sortField = 'lastCreated', sortAsc = false): Observable<[DocumentItem[], number]> {
    const params = {
    _startRow: page * 100,
    };
    if (model !== 'all') {
      params['queryModel'] = model;
    }
    if (query) {
      params['type'] = 'query';
      params[queryFiled] = query;
      // type=query&phrase=pr%C3%A1ce&queryTitle=pr%C3%A1ce
    } else {
      params['type'] = sortField;
      if (sortAsc) {
        params['_sort'] = 'asc';
      } else {
        params['_sort'] = 'desc';
      }
    }

    return this.get('object/search', params).pipe(map(response => [DocumentItem.fromJsonArray(response['response']['data']), response['response']['totalRows']] as [DocumentItem[], number]));
  }

  getCatalogSearchResults(catalog: string, field: string, query: string): Observable<CatalogueEntry[]> {
    const params = {
      catalog: catalog,
      fieldName: field,
      value: query
    };
    return this.get('bibliographies/query', params).pipe(map(response =>
      CatalogueEntry.fromJsonArray(response['metadataCatalogEntries']['entry'])));
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

  getCatalogs(): Observable<Catalogue[]> {
    return this.get('bibliographies').pipe(map(response => Catalogue.fromJsonArray(response['response']['data'])));
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


  editRelations(parentPid: string, pidArray: string[]): Observable<any> {
    const payload = {
      'parent': parentPid,
      'pid': pidArray
    };
    return this.put('object/member', payload);
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

  getImportBatch(id: number): Observable<Batch> {
    return this.get('import/batch', { id: id })
            .pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  getUsers(): Observable<User[]> {
    return this.get('user')
            .pipe(map(response => User.fromJsonArray(response['response']['data'])));
  }

  getThumbUrl(pid: string) {
    return this.getStreamUrl(pid, 'THUMBNAIL');
  }


  getStreamUrl(pid: string, stream: string) {
    return `${this.getApiUrl()}object/dissemination?pid=${pid}&datastream=${stream}`;
  }

}

