import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { Configuration } from '../shared/configuration';
import { ProArc } from '../utils/proarc';
import { UserSettings } from '../shared/user-settings';

describe('UserSettings MODS language', () => {
  it('uses the second language from the combined UI and MODS locale', () => {
    const settings = new UserSettings();
    settings.lang = 'cs-en';

    expect(settings.getModsLang()).toBe('en');
  });
});

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
      true,
      false,
      null,
      null,
      'medium',
      null,
      null,
      ['uuid:first', 'uuid:second']
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&generatePageType=true');
    expect(body).toContain('&pids=uuid:first,uuid:second');
  });

  it('sends selected pids with multiple import batches', () => {
    api.createImportBatches(
      ['/folder-1', '/folder-2'],
      'profile.test',
      true,
      true,
      null,
      null,
      null,
      null,
      ['uuid:first', 'uuid:second']
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&generatePageType=true');
    expect(body).toContain('&pids=uuid:first,uuid:second');
  });

  it('does not send pids when no objects were selected', () => {
    api.createImportBatch(
      '/folder',
      'profile.test',
      true,
      true,
      false,
      null,
      null,
      'medium',
      null,
      null
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).not.toContain('&pids=');
  });

  it('sends selected software with a single import batch', () => {
    api.createImportBatch(
      '/folder',
      'profile.test',
      true,
      true,
      false,
      'device:1',
      'uuid:software-set',
      'medium',
      null,
      null
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&device=device:1');
    expect(body).toContain('&software=uuid:software-set');
  });

  it('sends selected software with multiple import batches', () => {
    api.createImportBatches(
      ['/folder-1', '/folder-2'],
      'profile.test',
      true,
      true,
      null,
      'uuid:software-set',
      null,
      null
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).toContain('&software=uuid:software-set');
  });

  it('does not send software when none was selected', () => {
    api.createImportBatch(
      '/folder',
      'profile.test',
      true,
      true,
      false,
      null,
      null,
      'medium',
      null,
      null
    ).subscribe();

    const body = http.post.calls.mostRecent().args[1] as string;
    expect(body).not.toContain('&software=');
  });
});

describe('ApiService catalog search', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let api: ApiService;

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    http.get.and.returnValue(of({response: {}}));
    api = new ApiService(http, {proarcUrl: '/api'} as Configuration);
  });

  it('sends the MODS language when loading the catalog preview', () => {
    api.getCatalogSearchResults('metadata', 'catalog', 'title', 'query', 'en').subscribe();

    const options = http.get.calls.mostRecent().args[1] as any;
    expect(options.headers.get('Accept-Language')).toBe('en');
  });
});
