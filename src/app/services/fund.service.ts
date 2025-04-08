import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class FundService {

  private data: any;

  constructor(private http: HttpClient) { }

  getName(id: string): string {
    if (!id || id.indexOf("_NAD") < 0) {
      return "";
    }
    const archive = id.split("_NAD")[0];
    const fund: any = this.getFund(archive);
    if (!fund) {
      return "";
    }
    return fund[id.split("_NAD")[1]];
  }

  getFund(archiveId: string): Observable<any[]> {

    if (this.data) {
      return of(this.data[archiveId]);
    } else {
      let url = `/assets/funds.json`;
      return this.http.get(url).pipe(map((rsp: any) => {
        this.data = rsp;
        return rsp[archiveId];
      }));
      
    }

  }

  buildFullId(archiveId: string, id: string): string {
    return `${archiveId}_NAD${id}`;
  }


}
