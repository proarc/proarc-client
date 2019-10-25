import { Atm } from './../model/atm.model';
import { DocumentItem } from './../model/documentItem.model';
import { DigitalDocument } from 'src/app/model/document.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../model/device.model';

import { map } from 'rxjs/operators';


@Injectable()
export class ApiService {

  private static baseUrl = 'http://krameriustest.inovatika.cz/proarc-silvarium';

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

  getAtm(id: string): Observable<Atm> {
    return this.get('object/atm', { pid: id }).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  editAtmDevice(atm: Atm, device: string): Observable<Atm> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = `pid=${atm.pid}&device=${device}`;
    return this.put('object/atm', data, httpOptions).pipe(map(response => Atm.fromJson(response['response']['data'][0])));
  }

  getMods(id: string): Observable<DigitalDocument> {
    return this.get('object/mods/plain', { pid: id }).pipe(map(response =>
      new DigitalDocument(id, response['record']['content'], response['record']['timestamp'])));
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

  getRelations(root: string, parent: string): Observable<DocumentItem[]> {
    const params = {
      root: root,
      parent: parent
    };
    return this.get('object/member', params).pipe(map(response => DocumentItem.fromJsonArray(response['response']['data'])));
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
    const data = `id=${device.id}&label=${device.label}&timestamp=${device.timestamp}&description=${device.description()}`;
    return this.put('device', data, httpOptions).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }

  createDevice(): Observable<Device> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };
    const data = '';
    return this.post('device', data, httpOptions).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }

  
  getThumbUrl(pid: string) {
    return this.getStreamUrl(pid, 'THUMBNAIL');
  }


  getStreamUrl(pid: string, stream: string) {
    return `${ApiService.apiUrl}object/dissemination?pid=${pid}&datastream=${stream}`
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
