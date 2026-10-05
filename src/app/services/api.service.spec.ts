import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { Configuration } from '../shared/configuration';
import { ProArc } from '../utils/proarc';
import { UserSettings } from '../shared/user-settings';
import { Atm } from '../model/atm.model';

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

describe('ApiService bulk ATM changes', () => {
  let http: jasmine.SpyObj<HttpClient>;
  let api: ApiService;

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>('HttpClient', ['put']);
    http.put.and.returnValue(of({ response: { status: 0 } }));
    api = new ApiService(http, { proarcUrl: '/api' } as Configuration);
  });

  it('saves software together with the other ATM fields', () => {
    const atm = Atm.fromJson({ pid: 'uuid:item', device: 'device:1', software: 'software:old',
      status: 'described', model: 'model:ndkpage', userProcessor: 'processor',
      organization: 'library', donator: 'norway', archivalCopies: '/scans' });
    atm.software = 'software:new';
    api.editAtm(atm, '42').subscribe();
    const params = new URLSearchParams(http.put.calls.mostRecent().args[1].toString());
    expect(params.get('software')).toBe('software:new');
    expect(params.get('pid')).toBe('uuid:item');
    expect(params.get('device')).toBe('device:1');
    expect(params.get('donator')).toBe('norway');
    expect(params.get('archivalCopies')).toBe('/scans');
    expect(params.get('organization')).toBe('library');
    expect(params.get('userProcessor')).toBe('processor');
    expect(params.get('status')).toBe('described');
    expect(params.get('model')).toBe('model:ndkpage');
    expect(params.get('batchId')).toBe('42');
  });

  it('sends an explicit null to remove software from one object', () => {
    const atm = Atm.fromJson({ pid: 'uuid:item', software: 'software:old' });
    atm.software = 'null';
    expect(atm.hasChanged()).toBeTrue();
    api.editAtm(atm).subscribe();
    const params = new URLSearchParams(http.put.calls.mostRecent().args[1].toString());
    expect(params.get('software')).toBe('null');
    atm.restore();
    expect(atm.software).toBe('software:old');
    expect(atm.hasChanged()).toBeFalse();
  });

  it('initializes an object without software to the no software option', () => {
    const atm = Atm.fromJson({ pid: 'uuid:item' });
    expect(atm.software).toBe('null');
    expect(atm.hasChanged()).toBeFalse();
  });

  it('sends every selected PID and only the requested fields', () => {
    api.editAtmDevices(['uuid:first', 'uuid:second'], null, 'software:new', '123').subscribe();
    const [url, body] = http.put.calls.mostRecent().args;
    const params = new URLSearchParams(body.toString());
    expect(url).toBe('/api/rest/v2/object/atm');
    expect(params.getAll('pid')).toEqual(['uuid:first', 'uuid:second']);
    expect(params.get('software')).toBe('software:new');
    expect(params.get('batchId')).toBe('123');
    expect(params.has('device')).toBeFalse();
    expect(params.has('donator')).toBeFalse();
    expect(params.has('archivalCopies')).toBeFalse();
  });

  it('distinguishes removing an assignment from leaving it unchanged', () => {
    api.editAtmDevices(['uuid:first', 'uuid:second'], 'null').subscribe();
    const params = new URLSearchParams(http.put.calls.mostRecent().args[1].toString());
    expect(params.get('device')).toBe('null');
    expect(params.has('software')).toBeFalse();
    expect(params.has('batchId')).toBeFalse();
  });
});

describe('ApiService PREMIS regeneration', () => {
  it('posts repeated PID parameters and the import batch ID', () => {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
    http.post.and.returnValue(of({ response: { status: 0 } }));
    const api = new ApiService(http, { proarcUrl: '/api' } as Configuration);
    api.regeneratePremis(['uuid:first', 'uuid:second'], '42').subscribe();
    const [url, body] = http.post.calls.mostRecent().args;
    expect(url).toBe('/api/rest/v2/object/technicalMetadataXmlPremisGenerate');
    const params = new URLSearchParams(body.toString());
    expect(params.getAll('pid')).toEqual(['uuid:first', 'uuid:second']);
    expect(params.get('batchId')).toBe('42');
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
