import { ExportDialogComponent } from './export-dialog.component';

describe('ExportDialogComponent', () => {
  function createComponent(): ExportDialogComponent {
    return new ExportDialogComponent(
      null,
      null,
      null,
      null,
      null,
      null,
      [{pid: 'uuid:item', model: 'model:monograph'}]
    );
  }

  it('filters collections by localized name, description and PID', () => {
    const component = createComponent();
    component.importInstance = {
      krameriusInstanceId: 'k7',
      krameriusInstanceName: 'Kramerius 7',
      krameriusInstanceCollections: [
        {
          pid: 'uuid:first',
          names: {cze: 'Prvni sbirka', eng: 'First collection'},
          descriptions: {cze: 'Cesky popis', eng: 'English description'}
        },
        {pid: 'uuid:second', names: {cze: 'Druha sbirka', eng: 'Second collection'}}
      ]
    };

    component.collectionFilter = 'druha';
    expect(component.filteredCollections.map(collection => collection.pid)).toEqual(['uuid:second']);

    component.collectionFilter = 'uuid:first';
    expect(component.filteredCollections.map(collection => collection.pid)).toEqual(['uuid:first']);

    component.collectionFilter = 'cesky popis';
    expect(component.filteredCollections.map(collection => collection.pid)).toEqual(['uuid:first']);
  });

  it('uses Czech collection text and falls back to English', () => {
    const component = createComponent();
    const localizedCollection = {
      pid: 'uuid:first',
      names: {eng: 'English name', cze: 'Cesky nazev'},
      descriptions: {eng: 'English description', cze: 'Cesky popis'}
    };
    const englishCollection = {
      pid: 'uuid:second',
      names: {eng: 'English name'},
      descriptions: {en: 'English description'}
    };

    expect(component.collectionLabel(localizedCollection))
      .toBe('Cesky nazev (Cesky popis)');
    expect(component.collectionLabel(englishCollection))
      .toBe('English name (English description)');
  });

  it('summarizes only selected collections', () => {
    const component = createComponent();
    component.importInstance = {
      krameriusInstanceId: 'k7',
      krameriusInstanceName: 'Kramerius 7',
      krameriusInstanceCollections: [
        {
          pid: 'uuid:first',
          names: {cze: 'Prvni sbirka'},
          descriptions: {cze: 'Prvni popis'}
        },
        {pid: 'uuid:second', names: {cze: 'Druha sbirka'}},
        {pid: 'uuid:third', names: {cze: 'Treti sbirka'}}
      ]
    };
    component.selectedCollections = ['uuid:first', 'uuid:third'];

    expect(component.selectedCollectionLabels).toEqual([
      'Prvni sbirka (Prvni popis)',
      'Treti sbirka'
    ]);
    expect(component.selectedCollectionsSummaryKey).toBe('desc.krameriusCollectionsSummaryFew');

    component.collectionFilter = 'druha';
    component.setCollectionSelected('uuid:first', false);

    expect(component.collectionFilter).toBe('druha');
    expect(component.selectedCollections).toEqual(['uuid:third']);
    expect(component.selectedCollectionLabels).toEqual(['Treti sbirka']);
  });

  it('clears selected collections when metadata update is enabled', () => {
    const component = createComponent();
    component.selectedCollections = ['uuid:first'];
    component.updateMods = true;

    component.onUpdateModsChange();

    expect(component.selectedCollections).toEqual([]);
  });

  it('clears instance-specific selections after changing Kramerius instance', () => {
    const component = createComponent();
    component.licenseName = 'license';
    component.collectionFilter = 'query';
    component.selectedCollections = ['uuid:first'];

    component.onKrameriusInstanceChange();

    expect(component.licenseName).toBeNull();
    expect(component.collectionFilter).toBe('');
    expect(component.selectedCollections).toEqual([]);
  });
});
