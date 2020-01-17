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


@Injectable()
export class ApiService {

  private static baseUrl = 'http://krameriustest.inovatika.cz/proarc-silvarium';
  // private static baseUrl = 'http://localhost:8000/proarc';

  private static apiUrl = `${ApiService.baseUrl}/rest/v1/`;

  constructor(private http: HttpClient) {
  }


  private get(path: string, params = {}): Observable<Object> {
    return this.http.get(encodeURI(`${ApiService.apiUrl}${path}`), { params: params });
  }


  private put(path: string, body: any, options: any = {}): Observable<Object> {
    return this.http.put(encodeURI(`${ApiService.apiUrl}${path}`), body, options);
  }
  private post(path: string, body: any, options: any = {}): Observable<Object> {
    return this.http.post(encodeURI(`${ApiService.apiUrl}${path}`), body, options);
  }

  private delete(path: string, params = {}): Observable<Object> {
    return this.http.delete(encodeURI(`${ApiService.apiUrl}${path}`), { params: params });
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
    const payload = {
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
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${page.pid}&editorId=proarc.mods.PageForm&jsonData=${JSON.stringify(page.toJson())}&timestamp=${page.timestamp}`;
    return this.put('object/mods/custom', data, httpOptions).pipe(map(response => Page.fromJson(response['response']['data'][0])));
  }

  getAtm(id: string): Observable<Atm> {
    return this.get('object/atm', { pid: id }).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  editAtm(atm: Atm): Observable<Atm> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${atm.pid}&device=${atm.device}`;
    return this.put('object/atm', data, httpOptions).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
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
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${document.pid}&ignoreValidation=true&xmlData=${document.toMods()}&timestamp=${document.timestamp}`;
    return this.put('object/mods/custom', data, httpOptions);
  }

  editMods(mods: Mods): Observable<Mods> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${mods.pid}&ignoreValidation=true&xmlData=${mods.content}&timestamp=${mods.timestamp}`;
    return this.put('object/mods/custom', data, httpOptions).pipe(map(response => Mods.fromJson(response['response']['data'][0])));
  }


  getOcr(id: string): Observable<Ocr> {
    return this.get('object/ocr', { pid: id }).pipe(map(response =>
      Ocr.fromJson(response['record'])));
  }

  editOcr(ocr: Ocr): Observable<Ocr> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${ocr.pid}&content=${ocr.content}&timestamp=${ocr.timestamp}`;
    return this.put('object/ocr', data, httpOptions).pipe(map(response => Ocr.fromJson(response['record'])));
  }


  getNote(id: string): Observable<Note> {
    return this.get('object/privatenote', { pid: id }).pipe(map(response =>
      Note.fromJson(response['record'])));
  }

  editNote(note: Note): Observable<Note> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${note.pid}&content=${note.content}&timestamp=${note.timestamp}`;
    return this.put('object/privatenote', data, httpOptions).pipe(map(response => Note.fromJson(response['record'])));
  }

  getSearchResults(model: string, query: string, page: number): Observable<DocumentItem[]> {
    const params = {
    _startRow: page * 100,
      _endRow: 75
    };
    if (model !== 'all') {
      params['queryModel'] = model;
    }
    if (query) {
      params['type'] = 'query';
      params['queryTitle'] = query;
      // type=query&phrase=pr%C3%A1ce&queryTitle=pr%C3%A1ce
    } else {
      params['type'] = 'lastCreated';
    }
    return this.get('object/search', params).pipe(map(response => DocumentItem.fromJsonArray(response['response']['data'])));
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
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    // tslint:disable-next-line:max-line-length
    let data = `id=${device.id}&label=${device.label}&model=${device.model}&timestamp=${device.timestamp}&description=${device.description()}`;
    if (device.isAudio()) {
      data += `&audiotimestamp=${device.audiotimestamp}&audiodescription=${device.audioDescription()}`;
    }
    return this.put('device', data, httpOptions).pipe(map(response => Device.fromJson(response['response']['data'][0])));
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

  createDevice(model: string): Observable<Device> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `model=${model}`;
    return this.post('device', data, httpOptions).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }


  createImportBatch(path: string, profile: string, indices: boolean, device: string): Observable<Batch> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `folderPath=${path}&profile=${profile}&indices=${indices}&device=${device}`;
    return this.post('import/batch', data, httpOptions).pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }


  getImportBatch(id: number): Observable<Batch> {
    return this.get('import/batch', { id: id })
            .pipe(map(response => Batch.fromJson(response['response']['data'][0])));
  }

  getThumbUrl(pid: string) {
    return this.getStreamUrl(pid, 'THUMBNAIL');
  }


  getStreamUrl(pid: string, stream: string) {
    return `${ApiService.apiUrl}object/dissemination?pid=${pid}&datastream=${stream}`;
  }



  getMods2(uuid: string): Observable<Object> {
    const url = 'https://kramerius.mzk.cz/search/api/v5.0/item/' + uuid + '/streams/BIBLIO_MODS';
    return this.get2(url, {
      responseType: 'text'
   });
  }

  getDc(uuid: string): Observable<Object> {
    const url = 'https://kramerius.mzk.cz/search/api/v5.0/item/' + uuid + '/streams/DC';
    return this.get2(url, {
      responseType: 'text'
   });
  }


  getChildren(uuid: string): Observable<Object> {
    const url = 'https://kramerius.mzk.cz/search/api/v5.0/item/' + uuid + '/children';
    return this.http.get(url);
  }

  private get2(url: string, params = {}): Observable<Object> {
    return this.http.get(encodeURI(url), params);
  }


}




//http://krameriustest.inovatika.cz/proarc-silvarium/rest/v1/import/batch/item?batchId=1302&_operationType=fetch&_startRow=3&_endRow=5&_textMatchStyle=exact&_dataSource=ImportBatchItemDataSource&isc_metaDataPrefix=_&isc_dataFormat=json
// {"response":{"status":0,"startRow":3,"endRow":3,"totalRows":5,"data":[]}}