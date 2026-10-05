import { Premis, PremisTemplate } from './premis.model';

export const PREMIS_TEST_XML = `<m:mets xmlns:m="http://www.loc.gov/METS/"
  xmlns:p="info:lc/xmlns/premis-v2" xmlns:mix="http://www.loc.gov/mix/v20"
  xmlns:custom="urn:custom" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <m:amdSec ID="page"><m:digiprovMD ID="AGENT_001"><m:mdWrap MDTYPE="PREMIS"><m:xmlData>
    <p:agent><p:agentName>Scanner &amp; Camera</p:agentName><p:agentNote><!--keep--></p:agentNote></p:agent>
    <p:agent><p:agentName>Software</p:agentName><p:agentNote/></p:agent>
  </m:xmlData></m:mdWrap></m:digiprovMD>
  <m:techMD ID="OBJ_001"><m:mdWrap MDTYPE="PREMIS"><m:xmlData>
    <p:object xsi:type="p:file"><p:objectCharacteristics><p:objectCharacteristicsExtension>
      <mix:mix><mix:ImageCaptureMetadata><mix:ScannerCapture><mix:scannerManufacturer>Maker</mix:scannerManufacturer></mix:ScannerCapture></mix:ImageCaptureMetadata></mix:mix>
      <custom:extra code="x">Original extension</custom:extra>
    </p:objectCharacteristicsExtension></p:objectCharacteristics></p:object>
  </m:xmlData></m:mdWrap></m:techMD></m:amdSec>
</m:mets>`;

describe('Premis full document form', () => {
  let template: PremisTemplate;

  beforeAll(async () => {
    const response = await fetch('/assets/templates/premis/premis.template.json6');
    if (!response.ok) { throw new Error('PREMIS template could not be loaded'); }
    template = await response.json();
  });

  it('defines entities once and preserves their METS wrappers when adding new occurrences', () => {
    expect(Object.keys(template.elements).sort()).toEqual(['agent', 'event', 'object']);
    const xml = `<mets:mets xmlns:mets="http://www.loc.gov/METS/" xmlns:premis="info:lc/xmlns/premis-v2">
      <mets:amdSec>
        <mets:techMD ID="OBJ_001"><mets:mdWrap MIMETYPE="text/xml" MDTYPE="PREMIS"><mets:xmlData><premis:object/></mets:xmlData></mets:mdWrap></mets:techMD>
        <mets:digiprovMD ID="EVENT_001"><mets:mdWrap MIMETYPE="text/xml" MDTYPE="PREMIS"><mets:xmlData><premis:event/></mets:xmlData></mets:mdWrap></mets:digiprovMD>
        <mets:digiprovMD ID="AGENT_001"><mets:mdWrap MIMETYPE="text/xml" MDTYPE="PREMIS"><mets:xmlData><premis:agent/></mets:xmlData></mets:mdWrap></mets:digiprovMD>
      </mets:amdSec></mets:mets>`;
    const premis = new Premis(xml, 12, template);
    [...premis.roots].forEach(group => premis.addGroupAfter(group));
    const document = new DOMParser().parseFromString(premis.serialize(), 'application/xml');
    ['object', 'event', 'agent'].forEach(name => {
      const entities = Array.from(document.getElementsByTagNameNS(template.namespace, name));
      expect(entities.length).toBe(2);
      entities.forEach(entity => {
        const xmlData = entity.parentElement;
        const wrap = xmlData.parentElement;
        expect(xmlData.tagName).toBe('mets:xmlData');
        expect(wrap.tagName).toBe('mets:mdWrap');
        expect(wrap.getAttribute('MIMETYPE')).toBe('text/xml');
        expect(wrap.getAttribute('MDTYPE')).toBe('PREMIS');
        expect(wrap.parentElement.parentElement.tagName).toBe('mets:amdSec');
      });
    });
    expect(document.getElementsByTagNameNS(template.namespace, 'premis').length).toBe(0);
  });

  it('does not add top-level entities outside the required METS metadata wrappers', () => {
    const premis = new Premis('<mets:mets xmlns:mets="http://www.loc.gov/METS/" xmlns:p="info:lc/xmlns/premis-v2">' +
      '<mets:amdSec><p:agent/></mets:amdSec></mets:mets>', 12, template);
    expect(premis.canAddGroup(premis.roots[0])).toBeFalse();
    premis.addGroupAfter(premis.roots[0]);
    expect(premis.hasChanged()).toBeFalse();
  });

  it('adds nested object elements in XML order and restores structure after serialization', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    const object = premis.roots.find(group => group.node.localName === 'object');
    expect(object.children[0].node.localName).toBe('objectCharacteristics');
    premis.addElement(object, premis.availableElements(object).find(item => item.name === 'objectIdentifier'));
    const identifier = object.children[0];
    expect(identifier.node.localName).toBe('objectIdentifier');
    premis.addElement(identifier, premis.availableElements(identifier).find(item => item.name === 'objectIdentifierValue'));
    identifier.fields.find(field => field.label === 'Object Identifier Value').value = 'new & identifier';
    premis.addElement(identifier, premis.availableElements(identifier).find(item => item.name === 'objectIdentifierType'));
    identifier.fields.find(field => field.label === 'Object Identifier Type').value = 'local';
    expect(premis.availableElements(identifier).length).toBe(0);
    const document = new DOMParser().parseFromString(premis.serialize(), 'application/xml');
    const node = document.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'objectIdentifier')[0];
    expect(Array.from(node.children).map(child => child.localName)).toEqual(['objectIdentifierType', 'objectIdentifierValue']);
    expect(node.children[1].textContent).toBe('new & identifier');
    expect(document.getElementsByTagNameNS('urn:custom', 'extra')[0].textContent).toBe('Original extension');
    expect(premis.hasChanged()).toBeTrue();
    premis.restore();
    expect(premis.hasChanged()).toBeFalse();
    expect(premis.serialize()).not.toContain('<p:objectIdentifier>');
    expect(premis.serialize()).toContain('<!--keep-->');
  });

  it('removes nested elements without affecting repeated siblings and permits adding them again', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    const agent = premis.roots[0];
    const name = agent.fields.find(field => field.label === 'Agent Name');
    premis.removeField(agent, name);
    expect(new DOMParser().parseFromString(premis.serialize(), 'application/xml')
      .getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'agentName').length).toBe(1);
    expect(premis.roots[1].fields[0].value).toBe('Software');
    const object = premis.roots[2];
    premis.removeGroup(object.children[0]);
    expect(premis.groups.some(group => group.node.localName === 'ScannerCapture')).toBeFalse();
    premis.addElement(object, premis.availableElements(object).find(item => item.name === 'objectCharacteristics'));
    expect(object.children[0].template.children.some(item => item.name === 'fixity')).toBeTrue();
    premis.restore();
    expect(premis.hasChanged()).toBeFalse();
    expect(premis.serialize()).toContain('Original extension');
  });

  it('keeps METS wrappers and top-level entity references intact', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    premis.roots.forEach(group => premis.removeGroup(group));
    expect(premis.hasChanged()).toBeFalse();
    expect(premis.serialize()).toContain('ID="OBJ_001"');
  });

  it('appends blank top-level entities after existing entities of their type in new METS sections', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    const agent = premis.roots[0];
    premis.addGroupAfter(agent);
    expect(premis.roots.map(group => group.node.localName)).toEqual(['agent', 'agent', 'agent', 'object']);
    expect(premis.roots[2].fields.length).toBe(3);
    expect(premis.roots[2].fields.every(field => field.value === '')).toBeTrue();
    expect(premis.roots[1].fields[0].value).toBe('Software');
    expect(premis.roots[2].label).toBe('page / AGENT_002 / Agent');
    premis.removeGroup(premis.roots[2]);
    expect(premis.hasChanged()).toBeFalse();
    const object = premis.roots[2];
    premis.addGroupAfter(object);
    expect(premis.roots[3].node.getAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'type')).toBe('p:file');
    expect(premis.roots[3].node.parentElement).not.toBe(object.node.parentElement);
    expect(premis.roots[3].label).toBe('page / OBJ_002 / Object');
    premis.restore();
    expect(premis.hasChanged()).toBeFalse();
  });

  it('allocates IDs independently for Agent, Event and Object and appends after the last section of each type', () => {
    const xml = `<m:mets xmlns:m="http://www.loc.gov/METS/" xmlns:p="info:lc/xmlns/premis-v2"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><m:amdSec ID="PAGE_0001">
      <m:digiprovMD ID="AGENT_001"><m:mdWrap MDTYPE="PREMIS:AGENT"><m:xmlData><p:agent><p:agentName>First</p:agentName></p:agent></m:xmlData></m:mdWrap></m:digiprovMD>
      <m:digiprovMD ID="AGENT_004"><m:mdWrap MDTYPE="PREMIS:AGENT"><m:xmlData><p:agent><p:agentName>Last</p:agentName></p:agent></m:xmlData></m:mdWrap></m:digiprovMD>
      <m:digiprovMD ID="EVENT_003"><m:mdWrap MDTYPE="PREMIS:EVENT"><m:xmlData><p:event><p:eventType>capture</p:eventType></p:event></m:xmlData></m:mdWrap></m:digiprovMD>
      <m:techMD ID="OBJ_007"><m:mdWrap MDTYPE="PREMIS:OBJECT"><m:xmlData><p:object xsi:type="p:file"><p:originalName>original.xml</p:originalName></p:object></m:xmlData></m:mdWrap></m:techMD>
      </m:amdSec><m:amdSec ID="PAGE_0002"><m:digiprovMD ID="AGENT_009"><m:mdWrap><m:xmlData><p:agent/></m:xmlData></m:mdWrap></m:digiprovMD></m:amdSec></m:mets>`;
    const premis = new Premis(xml, 12, template);
    const agent = premis.roots[0];
    const event = premis.roots[2];
    const object = premis.roots[3];
    premis.addGroupAfter(agent);
    premis.addGroupAfter(agent);
    premis.addGroupAfter(event);
    premis.addGroupAfter(object);
    const document = new DOMParser().parseFromString(premis.serialize(), 'application/xml');
    const page = document.getElementsByTagNameNS('http://www.loc.gov/METS/', 'amdSec')[0];
    expect(Array.from(page.children).map(child => child.getAttribute('ID')))
      .toEqual(['AGENT_001', 'AGENT_004', 'AGENT_010', 'AGENT_011', 'EVENT_003', 'EVENT_004', 'OBJ_007', 'OBJ_008']);
    const ids = Array.from(document.querySelectorAll('[ID]')).map(element => element.getAttribute('ID'));
    expect(new Set(ids).size).toBe(ids.length);
    const addedAgent = Array.from(page.children).find(child => child.getAttribute('ID') === 'AGENT_010');
    expect(addedAgent.children[0].getAttribute('MDTYPE')).toBe('PREMIS:AGENT');
    expect(addedAgent.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'agent').length).toBe(1);
    expect(addedAgent.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'agentName').length).toBe(0);
    expect(premis.roots.filter(group => group.node.localName === 'agent').slice(0, 4).map(group => group.label))
      .toEqual(['PAGE_0001 / AGENT_001 / Agent', 'PAGE_0001 / AGENT_004 / Agent',
        'PAGE_0001 / AGENT_010 / Agent', 'PAGE_0001 / AGENT_011 / Agent']);
    const reloaded = new Premis(premis.serialize(), 13, template);
    expect(reloaded.roots.map(group => group.label)).toEqual(premis.roots.map(group => group.label));
    premis.restore();
    expect(premis.hasChanged()).toBeFalse();
  });

  it('repeats a field after the selected occurrence and respects singleton limits', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    const agent = premis.roots[0];
    const name = agent.fields.find(field => field.label === 'Agent Name');
    const item = premis.fieldTemplate(agent, name);
    premis.addElement(agent, item, name.node as Element);
    expect(agent.fields[1].label).toBe('Agent Name');
    expect(agent.fields[1].value).toBe('');
    expect(agent.fields[0].value).toBe('Scanner & Camera');
    expect((name.node as Element).nextElementSibling.localName).toBe('agentName');
    const object = premis.roots[2];
    const originalName = premis.availableElements(object).find(definition => definition.name === 'originalName');
    premis.addElement(object, originalName);
    const field = object.fields.find(candidate => candidate.label === 'Original Name');
    premis.addElement(object, originalName, field.node as Element);
    expect(Array.from(object.node.children).filter(child => child.localName === 'originalName').length).toBe(1);
    expect(premis.availableElements(object)).not.toContain(originalName);
  });

  it('exposes blank scalar inputs without adding absent XML elements on load', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    const object = premis.roots[2];
    const name = object.fields.find(field => field.label === 'Original Name');
    expect(name.value).toBe('');
    expect(premis.canAddField(object, name)).toBeFalse();
    expect(premis.hasChanged()).toBeFalse();
    expect(premis.serialize()).not.toContain('<p:originalName');
    name.value = 'page & new.xml';
    expect(premis.serialize()).toContain('<p:originalName>page &amp; new.xml</p:originalName>');
    premis.removeField(object, name);
    expect(object.fields.find(field => field.label === 'Original Name').value).toBe('');
    expect(premis.hasChanged()).toBeFalse();
  });

  it('repeats an initially absent scalar field at the same level and keeps its inputs independent', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12, template);
    const object = premis.roots[2];
    premis.addElement(object, premis.availableElements(object).find(item => item.name === 'preservationLevel'));
    const preservation = object.children.find(group => group.node.localName === 'preservationLevel');
    const rationale = preservation.fields.find(field => field.label === 'Preservation Level Rationale');
    expect(premis.canAddField(preservation, rationale)).toBeTrue();
    premis.addFieldAfter(preservation, rationale);
    const values = preservation.fields.filter(field => field.label === 'Preservation Level Rationale');
    expect(values.length).toBe(2);
    values[0].value = 'First';
    values[1].value = 'Second';
    const xml = new DOMParser().parseFromString(premis.serialize(), 'application/xml');
    expect(Array.from(xml.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'preservationLevelRationale'))
      .map(node => node.textContent)).toEqual(['First', 'Second']);
    premis.restore();
    expect(premis.hasChanged()).toBeFalse();
  });

  it('edits repeated agents independently and preserves MIX, extensions and METS identifiers', () => {
    const premis = new Premis(PREMIS_TEST_XML, -1);
    const fields = premis.groups.flatMap(group => group.fields);
    const names = fields.filter(field => field.label === 'Agent Name');
    expect(names.length).toBe(2);
    expect(new Set(premis.groups.map(group => group.key)).size).toBe(premis.groups.length);
    names[1].value = 'Český software + 100% & <nový>';
    fields.find(field => field.label === 'Scanner Manufacturer').value = 'New maker';
    expect(premis.hasChanged()).toBeTrue();
    const document = new DOMParser().parseFromString(premis.serialize(), 'application/xml');
    expect(document.getElementsByTagName('parsererror').length).toBe(0);
    expect(document.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'agentName')[0].textContent).toBe('Scanner & Camera');
    expect(document.getElementsByTagNameNS('info:lc/xmlns/premis-v2', 'agentName')[1].textContent).toBe(names[1].value);
    expect(document.getElementsByTagNameNS('http://www.loc.gov/mix/v20', 'scannerManufacturer')[0].textContent).toBe('New maker');
    expect(document.getElementsByTagNameNS('urn:custom', 'extra')[0].getAttribute('code')).toBe('x');
    expect(document.getElementsByTagNameNS('http://www.loc.gov/METS/', 'techMD')[0].getAttribute('ID')).toBe('OBJ_001');
    expect(premis.serialize()).toContain('<!--keep-->');
    expect(premis.serialize()).toContain('xsi:type="p:file"');
  });

  it('restores values even after serialization and edits empty fields', () => {
    const premis = new Premis(PREMIS_TEST_XML, 12);
    const note = premis.groups.flatMap(group => group.fields).find(field => field.label === 'Agent Note');
    note.value = 'Note';
    expect(premis.serialize()).toContain('>Note</p:agentNote>');
    premis.restore();
    expect(premis.hasChanged()).toBeFalse();
    expect(premis.serialize()).not.toContain('>Note</p:agentNote>');
  });

  it('rejects malformed XML and documents outside the METS namespace', () => {
    expect(() => new Premis('<mets>', 1)).toThrow();
    expect(() => new Premis('<mets/>', 1)).toThrow();
    expect(() => new Premis('<p:agent xmlns:p="info:lc/xmlns/premis-v2"/>', 1)).toThrow();
  });
});
