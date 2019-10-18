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

  getDevices(): Observable<Device[]> {
    return this.get('device').pipe(map(response => Device.fromJsonArray(response['response']['data'])));
  }


  getDevice(deviceId: string): Observable<Device> {
    return this.get('device', { id: deviceId }).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }



  getMods(uuid: string): Observable<Object> {
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
    return this.http.get(url)
  }

  private get2(url: string, params = {}): Observable<Object> {
    return this.http.get(encodeURI(url), params);
  }


}
