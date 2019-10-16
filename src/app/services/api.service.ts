import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getMods(uuid: string): Observable<Object> {
    const url = 'https://kramerius.mzk.cz/search/api/v5.0/item/' + uuid + '/streams/BIBLIO_MODS';
    return this.get(url, {
      responseType: 'text'
   });
  }

  getDc(uuid: string): Observable<Object> {
    const url = 'https://kramerius.mzk.cz/search/api/v5.0/item/' + uuid + '/streams/DC';
    return this.get(url, {
      responseType: 'text'
   });
  }


  getChildren(uuid: string): Observable<Object> {
    const url = 'https://kramerius.mzk.cz/search/api/v5.0/item/' + uuid + '/children';
    return this.http.get(url)
  }

  private get(url: string, params = {}): Observable<Object> {
    return this.http.get(encodeURI(url), params);
  }


}
