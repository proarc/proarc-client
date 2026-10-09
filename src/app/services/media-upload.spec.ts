import { HttpClient } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { Configuration } from '../shared/configuration';

describe('Upload digital content to selected objects', () => {
  let api: ApiService;
  let http: jasmine.SpyObj<HttpClient>;
  const file = new File(['%PDF-1.4'], 'article.pdf', {type: 'application/pdf'});

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
    api = new ApiService(http, {proarcUrl: '/api'} as Configuration);
  });

  it('uploads the same file sequentially, once per distinct PID', () => {
    const first = new Subject<Object>();
    http.post.and.returnValues(first, of({response: {status: 0}}));
    const results: string[] = [];
    api.uploadFileToObjects(file, ['uuid:1', 'uuid:2', 'uuid:1'], file.type)
      .subscribe(result => results.push(result.pid));
    expect(http.post.calls.count()).toBe(1);
    first.next({response: {status: 0}});
    expect(http.post.calls.count()).toBe(1);
    first.complete();
    expect(results).toEqual(['uuid:1', 'uuid:2']);
    expect(http.post.calls.count()).toBe(2);
    http.post.calls.allArgs().forEach(([url, body], index) => {
      expect(url).toBe('/api/rest/v2/object/dissemination');
      const data = body as FormData;
      expect(data.get('pid')).toBe('uuid:' + (index + 1));
      expect(data.get('file')).toBe(file);
      expect(data.get('mime')).toBe('application/pdf');
      expect(data.get('jsonErrors')).toBe('true');
    });
  });

  it('continues after a server validation failure and an HTTP failure', () => {
    const invalid = {response: {status: -1, errorMessage: 'Object is locked'}};
    http.post.and.returnValues(of(invalid), throwError(() => ({status: 403, error: 'Forbidden'})),
      of({response: {status: 0}}));
    const results: any[] = [];
    api.uploadFileToObjects(file, ['uuid:1', 'uuid:2', 'uuid:3'], file.type)
      .subscribe(result => results.push(result));
    expect(results.length).toBe(3);
    expect(results[0].response.response.errorMessage).toBe('Object is locked');
    expect(results[1].response.response.status).toBe(403);
    expect(results[2].response.response.status).toBe(0);
  });
});
