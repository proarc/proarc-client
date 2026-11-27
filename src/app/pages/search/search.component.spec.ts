import { SearchComponent } from './search.component';
import { UserSettings } from '../../shared/user-settings';

describe('Search LTP column filters', () => {
  let component: SearchComponent;
  let settings: UserSettings;
  let save: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    settings = new UserSettings();
    settings.columnsSearch = [
      { field: 'ltpId', selected: false, width: 180, type: 'string' },
      { field: 'ltpStatus', selected: false, width: 180, type: 'translated' }
    ];
    save = jasmine.createSpy('save');
    navigate = jasmine.createSpy('navigate').and.resolveTo(true);
    component = new SearchComponent(null, null, settings, { save } as any, null, null,
      { navigate } as any, null, { defaultModel: 'all' } as any, null);
  });

  it('reveals only the column needed by a shared filter link', () => {
    component.processParams({ ltpState: 'cesnet:STORED' });
    expect(component.isSearchColumnVisible('ltpStatus')).toBeTrue();
    expect(component.isSearchColumnVisible('ltpId')).toBeFalse();
    expect(component.ltpState).toBe('cesnet:STORED');
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('updates an existing results table when a link reveals a column', () => {
    component.resultTable = { initColumns: jasmine.createSpy('initColumns') } as any;
    component.processParams({ ltpId: 'package-123' });
    expect(component.resultTable.initColumns).toHaveBeenCalledWith('columnsSearch');
    expect(component.isSearchColumnVisible('ltpId')).toBeTrue();
  });

  it('clears a hidden active filter without submitting other form edits', () => {
    settings.columnsSearch[1].selected = true;
    component.urlParams = { ltpId: 'package-123', ltpState: 'cesnet:STORED', queryLabel: 'original' };
    component.ltpId = 'package-123';
    component.ltpState = 'cesnet:STORED';
    component.queryLabel = 'unfinished edit';
    component.onSearchColumnsChanged();
    expect(component.ltpId).toBe('');
    expect(component.ltpState).toBe('cesnet:STORED');
    expect(navigate).toHaveBeenCalledOnceWith([], {
      queryParams: { ltpId: null, ltpState: 'cesnet:STORED', pageIndex: null },
      queryParamsHandling: 'merge'
    });
  });

  it('discards a hidden draft filter without reloading results', () => {
    component.ltpId = 'unfinished package';
    component.onSearchColumnsChanged();
    expect(component.ltpId).toBe('');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('keeps saved column choices when opening search without LTP filters', () => {
    settings.columnsSearch[0].selected = true;
    component.processParams({});
    expect(component.isSearchColumnVisible('ltpId')).toBeTrue();
    expect(component.isSearchColumnVisible('ltpStatus')).toBeFalse();
    expect(save).not.toHaveBeenCalled();
  });
});
