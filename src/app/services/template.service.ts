import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import * as JSON5 from 'json5';
import { ModelTemplate } from '../templates/modelTemplate';
var JSON6 = require('json-6');

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  static instance: TemplateService;

  templates: { [standard: string]: { [model: string]: any } } = { "aacr": {}, "rda": {} };

  constructor(private http: HttpClient) {
    TemplateService.instance = this;
  }

  addTemplate(standard: string, model: string, tmpl: any) {
    this.templates[standard][model] = tmpl;
  }

  getTemplate(standard: string, model: string) {
    if (this.templates[standard][model]) {
      return of(this.templates[standard][model]);
    } else {
      const name = ModelTemplate.mappings[standard][model];
      if (name) {
        let url = `/assets/templates/${standard}/${name}.${standard}.template.json6`;
        return this.http.get(url, { responseType: 'text' }).pipe(map((rsp: any) => {
          // console.log(rsp)
          const rsp2 = JSON6.parse(rsp);
          this.addTemplate(standard, model, rsp2);
          return rsp2;
        }));
      } else {
        return of(null);
      }
    }

  }

}
