
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Ruian } from '../model/ruian.model';
import { Observable } from 'rxjs';

@Injectable()
export class CuzkService {

  private static baseUrl = 'http://ags.cuzk.cz/arcgis/rest/services/RUIAN/Vyhledavaci_sluzba_nad_daty_RUIAN/MapServer/find';

  constructor(private http: HttpClient) {
  }


  public search(query: string): Observable<Ruian[]> {
    const params = {
      'searchText': query,
      'contains': true,
      'searchFields': 'nazev',
      'layers': '1,4,7,11,12,15,16,17,19',
      'returnGeometry' : false,
      'returnZ' : false,
      'returnM' :false,
      'returnUnformattedValues': false,
      'returnFieldName': true,
      'f': 'json'
    } as any;
    return this.http.get(CuzkService.baseUrl, { params: params }).pipe(map(response => Ruian.fromJsonArray(response['results'])));
  }

  public searchAddresses(query: string): Observable<Ruian[]> {
    const params = {
      'searchText': query,
      'contains': true,
      'searchFields': 'adresa',
      'layers': '1',
      'returnGeometry' : false,
      'returnZ' : false,
      'returnM' :false,
      'returnUnformattedValues': false,
      'returnFieldName': true,
      'f': 'json'
    } as any;
    return this.http.get(CuzkService.baseUrl, { params: params }).pipe(map(response => Ruian.fromJsonArray(response['results'])));
  }

  public searchByCode(code: string, layerId: number): Observable<Ruian[]> {
    const params = {
      'searchText': code,
      'contains': false,
      'searchFields': 'kod',
      'layers': layerId + '',
      'returnGeometry' : false,
      'returnZ' : false,
      'returnM' :false,
      'returnUnformattedValues': false,
      'returnFieldName': true,
      'f': 'json'
    } as any;
    return this.http.get(CuzkService.baseUrl, { params: params }).pipe(map(response => Ruian.fromJsonArray(response['results'])));
  }

  // private get(path: string, params = {}): Observable<Object> {
  //   return this.http.get(encodeURI(`${ApiService.apiUrl}${path}`), { params: params });
  // }
}