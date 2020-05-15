
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Ruian } from '../model/ruian.model';
import { Observable } from 'rxjs';

@Injectable()
export class OsmService {

  private static baseUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {
  }

  public findAddress(lat: number, lon: number): Observable<any> {
    const params = {
      'format': 'json',
      'lat-language': 'cz',
      'lat': lat,
      'lon': lon
    } as any;
    return this.http.get(OsmService.baseUrl, { params: params });
  }

}