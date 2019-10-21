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

  getDevices(): Observable<Device[]> {
    return this.get('device').pipe(map(response => Device.fromJsonArray(response['response']['data'])));
  }


  getDevice(deviceId: string): Observable<Device> {
    return this.get('device', { id: deviceId }).pipe(map(response => Device.fromJson(response['response']['data'][0])));
  }

  editDevice(device: Device): Observable<Device> {
    const body = {
      id: device.id,
      label: device.name
    }


    const httpOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/json',
'Accept-Language': 'cs',
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    };



    var data: any = new FormData();
    data.append("id", 'device:d4a07247-5f17-4269-b868-34f43655b090');
    data.append("label", 'test');


    const data2 = `id=device:d4a07247-5f17-4269-b868-34f43655b090&label=test`;

    const data3 = `id=device%3Ad4a07247-5f17-4269-b868-34f43655b090&label=dgdfg2&description=%7B%22ImageCaptureMetadata%22%3A%7B%22GeneralCaptureInformation%22%3A%7B%22imageProducer%22%3A%7B%22value%22%3A%22producer%22%7D%7D%7D%7D&timestamp=1571647849609&_operationType=update&_textMatchStyle=exact&_dataSource=DeviceDataSource&isc_metaDataPrefix=_&isc_dataFormat=json`;
    
    const data4 = `label=tessst`;

    return this.post('device', data3, httpOptions).pipe(map(response => Device.fromJson(response['response']['data'][0])));
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
