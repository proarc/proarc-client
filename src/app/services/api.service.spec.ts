import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { Configuration } from '../shared/configuration';
import { ProArc } from '../utils/proarc';

describe('ApiService export collections', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let api: ApiService;

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
    http.post.and.returnValue(of({response: {}}));
    api = new ApiService(http, {proarcUrl: '/api'} as Configuration);
  });

  it('sends repeated collection parameters with Kramerius export', () => {
    api.export(
      ProArc.EXPORT_KRAMERIUS,
      ['uuid:item'],
      'public',
      false,
      'k7',
      '',
      '',
      '',
      '',
      '',
      false,
      'medium',
      false,
      ['uuid:first', 'uuid:second']
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&collection=uuid%3Afirst');
    expect(body).toContain('&collection=uuid%3Asecond');
  });

  it('sends repeated collection parameters with NDK Kramerius upload', () => {
    api.export(
      ProArc.EXPORT_NDK_KRAMERIUS_UPLOAD,
      ['uuid:item'],
      'public',
      false,
      'k7',
      '',
      '',
      '',
      '',
      '',
      false,
      'medium',
      false,
      ['uuid:first', 'uuid:second']
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&collection=uuid%3Afirst');
    expect(body).toContain('&collection=uuid%3Asecond');
  });
});

describe('ApiService import pids', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let api: ApiService;

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
    http.post.and.returnValue(of({response: {}}));
    api = new ApiService(http, {proarcUrl: '/api'} as Configuration);
  });

  it('sends selected pids with a single import batch', () => {
    api.createImportBatch(
      '/folder',
      'profile.test',
      true,
      false,
      null,
      'medium',
      null,
      null,
      ['uuid:first', 'uuid:second']
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&pids=uuid:first,uuid:second');
  });

  it('sends selected pids with multiple import batches', () => {
    api.createImportBatches(
      ['/folder-1', '/folder-2'],
      'profile.test',
      true,
      null,
      null,
      null,
      ['uuid:first', 'uuid:second']
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&pids=uuid:first,uuid:second');
  });

  it('does not send pids when no objects were selected', () => {
    api.createImportBatch(
      '/folder',
      'profile.test',
      true,
      false,
      null,
      'medium',
      null,
      null
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).not.toContain('&pids=');
  });
});
