import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ModelTemplate } from '../model/modelTemplate';
import { ModsFieldTemplate, ModsTemplate } from '../model/mods-template';
//var JSON6 = require('json-6');
//import JSON6 = require('json-6');
declare var JSON6: any;

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  static instance: TemplateService;

  templates: { [standard: string]: { [model: string]: ModsTemplate } } = { "aacr": {}, "rda": {} };
  parts: { [filename: string]: ModsFieldTemplate } = {};

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
          const rsp2: ModsTemplate = JSON6.parse(rsp);
          this.processTemplate(rsp2);
          this.addTemplate(standard, model, rsp2);
          return rsp2;
        }));
      } else {
        return of(null);
      }
    }
  }

  // Process includes in template
  processTemplate(tmpl: ModsTemplate) {
    const fields = Object.keys(tmpl);
    fields.forEach(async f => {
      if (tmpl[f]._include) {
        const fieldTmpl: ModsFieldTemplate = await this.loadField(tmpl[f]._include).toPromise();
        // console.log(fieldTmpl)
        if (tmpl[f].usage) {
          fieldTmpl.usage = tmpl[f].usage;
        }
        if (tmpl[f].description) {
          fieldTmpl.description = tmpl[f].description;
        }
        if (tmpl[f].required) {
          fieldTmpl.required = tmpl[f].required;
        }
        if (tmpl[f].fields) {
          const ks = Object.keys(fieldTmpl.fields);
          const iks = Object.keys(tmpl[f].fields);
          ks.forEach(sf => {
            if (!iks.includes(sf)) {
              delete fieldTmpl.fields[sf];
            } else {
              iks.forEach(k => {
                const tmplF = Object.keys(tmpl[f].fields[sf]);
                const a : any = fieldTmpl.fields[sf]
                tmplF.forEach(j => {
                  if (j === '_include') {

                  } else {
                    a[j] = tmpl[f].fields[sf][j as keyof (ModsFieldTemplate)];
                  }
                  
                });
              });
              
            }
          });
          
        }
        tmpl[f] = fieldTmpl;
      }
    });
  }

  loadField(filename: string) {
    if (this.parts[filename]) {
      return of(this.parts[filename]);
    } else {
      let url = `/assets/templates/fields/${filename}.json6`;
      return this.http.get(url, { responseType: 'text' }).pipe(map((rsp: any) => {
        const rsp2: ModsFieldTemplate = JSON6.parse(rsp);
        this.processFieldTemplate(rsp2);
        this.parts[filename] = rsp2;
        return rsp2;
      }));
    }
  }

  // Process includes in template
  processFieldTemplate(tmpl: ModsFieldTemplate) {
    const fields = Object.keys(tmpl.fields);
    fields.forEach(async f => {
      if (tmpl.fields[f]._include) {
        const fieldTmpl: ModsFieldTemplate = await this.loadField(tmpl.fields[f]._include).toPromise();



        if (tmpl.fields[f].usage) {
          fieldTmpl.usage = tmpl.fields[f].usage;
        }
        if (tmpl.fields[f].description) {
          fieldTmpl.description = tmpl.fields[f].description;
        }
        if (tmpl.fields[f].required) {
          fieldTmpl.required = tmpl.fields[f].required;
        }
        if (tmpl.fields[f].fields) {
          const ks = Object.keys(fieldTmpl.fields);
          const iks = Object.keys(tmpl.fields[f].fields);
          ks.forEach(sf => {
            if (!iks.includes(sf)) {
              delete fieldTmpl.fields[sf];
            } else {
              iks.forEach(k => {
                const tmplF = Object.keys(tmpl.fields[f].fields[sf]);
                const a : any = fieldTmpl.fields[sf]
                tmplF.forEach(j => {
                  if (j === '_include') {

                  } else {
                    a[j] = tmpl.fields[f].fields[sf][j as keyof (ModsFieldTemplate)];
                  }
                  
                });
              });
              
            }
          });
          
        }

        tmpl.fields[f] = fieldTmpl;
      }
    });
  }


}
