import { DocumentItem } from '../../model/documentItem.model';
import { ObjectTargetSelectionDialogComponent } from './object-target-selection-dialog.component';

describe('ObjectTargetSelectionDialogComponent selection', () => {
  function createComponent(mode: 'distribution' | 'import'): ObjectTargetSelectionDialogComponent {
    return new ObjectTargetSelectionDialogComponent(
      {pages: [], expandedPath: [], mode},
      jasmine.createSpyObj('MatDialogRef', ['close']),
      {} as any,
      {models: []} as any,
      {} as any,
      jasmine.createSpyObj('UserSettingsService', ['save'])
    );
  }

  function item(pid: string): DocumentItem {
    return Object.assign(new DocumentItem(), {pid, label: pid, model: 'model:test'});
  }

  it('keeps objects added by consecutive plain clicks in import mode', () => {
    const component = createComponent('import');
    const first = item('uuid:first');
    const second = item('uuid:second');
    component.items = [first, second];

    component.selectSearchTarget({item: first, idx: 0});
    component.selectSearchTarget({item: second, idx: 1});

    expect(component.selectedTargets.map(target => target.pid)).toEqual(['uuid:first', 'uuid:second']);
  });

  it('removes one selected import object without clearing the others', () => {
    const component = createComponent('import');
    const first = item('uuid:first');
    const second = item('uuid:second');
    component.items = [first, second];
    component.selectSearchTarget({item: first, idx: 0});
    component.selectSearchTarget({item: second, idx: 1});

    component.removeTarget(first);

    expect(component.selectedTargets).toEqual([second]);
    expect(first.selected).toBeFalse();
  });

  it('keeps single-selection behavior in distribution mode', () => {
    const component = createComponent('distribution');
    const first = item('uuid:first');
    const second = item('uuid:second');
    component.items = [first, second];

    component.selectSearchTarget({item: first, idx: 0});
    component.selectSearchTarget({item: second, idx: 1});

    expect(component.selectedTargets).toEqual([second]);
  });
});
