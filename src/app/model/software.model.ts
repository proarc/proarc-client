import { TableItem } from './table-item.model';

export const SOFTWARE_MODELS = {
  agent: 'proarc:softwareagent',
  event: 'proarc:softwareevent',
  object: 'proarc:softwareobject',
  set: 'proarc:softwareset'
} as const;

export type SoftwareType = keyof typeof SOFTWARE_MODELS;

export interface SoftwareMetadataField {
  key: string;
  label: string;
  value: string;
}

export interface SoftwareMetadataGroup {
  key: string;
  label: string;
  rootLevel: boolean;
  fields: SoftwareMetadataField[];
}

export interface SoftwarePage {
  items: Software[];
  startRow: number;
  endRow: number;
  totalRows: number;
}

export class Software extends TableItem {
  id: string;
  label: string;
  model: string;
  description: string;
  members: string[] = [];
  metadataFields: SoftwareMetadataField[] = [];
  metadataGroups: SoftwareMetadataGroup[] = [];
  private metadataDocument: Document;
  private metadataElements = new Map<string, Element>();

  static fromJson(json: any): Software {
    if (!json) {
      return null;
    }
    const software = new Software();
    software.id = json.id;
    software.pid = json.id;
    software.label = json.label;
    software.model = json.model;
    software.description = json.description || '';
    software.members = Array.isArray(json.members) ? [...json.members] : [];
    software.timestamp = json.timestamp === null || json.timestamp === undefined
      ? null
      : new Date(Number(json.timestamp));
    software.readMetadata();
    return software;
  }

  static typeFromModel(model: string): SoftwareType {
    return (Object.keys(SOFTWARE_MODELS) as SoftwareType[])
      .find(type => SOFTWARE_MODELS[type] === model);
  }

  static modelFromType(type: string): string {
    return SOFTWARE_MODELS[type as SoftwareType];
  }

  static memberModel(model: string): string {
    switch (model) {
      case SOFTWARE_MODELS.event:
        return SOFTWARE_MODELS.agent;
      case SOFTWARE_MODELS.object:
        return SOFTWARE_MODELS.event;
      case SOFTWARE_MODELS.set:
        return SOFTWARE_MODELS.object;
      default:
        return null;
    }
  }

  static defaultMetadataTypes(model: string): string[] {
    switch (model) {
      case SOFTWARE_MODELS.agent:
        return ['default'];
      case SOFTWARE_MODELS.event:
        return ['eventDigitalization', 'eventCreation', 'eventXmlCreation', 'eventDeletion'];
      case SOFTWARE_MODELS.object:
        return ['objectPreservationArchival', 'objectPreservationAlto', 'objectDeletionTif'];
      default:
        return [];
    }
  }

  static formatXml(xml: string): string {
    if (!xml) {
      return '';
    }
    const lines = xml.replace(/>\s*</g, '><').replace(/></g, '>\n<').split('\n');
    let depth = 0;
    return lines.map(line => {
      if (/^<\//.test(line)) {
        depth = Math.max(0, depth - 1);
      }
      const formatted = `${'  '.repeat(depth)}${line}`;
      if (/^<[^!?/][^>]*[^/]>/.test(line) && !/<\/[^>]+>$/.test(line)) {
        depth++;
      }
      return formatted;
    }).join('\n');
  }

  serializedDescription(): string {
    if (!this.metadataDocument) {
      return this.description || '';
    }
    this.metadataFields.forEach(field => {
      const element = this.metadataElements.get(field.key);
      if (element) {
        element.textContent = field.value ?? '';
      }
    });
    return new XMLSerializer().serializeToString(this.metadataDocument);
  }

  private readMetadata(): void {
    this.metadataFields = [];
    this.metadataGroups = [];
    this.metadataElements.clear();
    this.metadataDocument = null;
    if (!this.description?.trim()) {
      return;
    }
    const document = new DOMParser().parseFromString(this.description, 'application/xml');
    if (document.getElementsByTagName('parsererror').length) {
      return;
    }
    this.metadataDocument = document;
    const counters = new Map<string, number>();
    const groupCounters = new Map<string, number>();
    const groups = new Map<Element, SoftwareMetadataGroup>();
    const premisRoot = Array.from(document.getElementsByTagNameNS('info:lc/xmlns/premis-v2', '*'))
      .find(element => ['agent', 'event', 'object'].includes(element.localName));
    Array.from(document.getElementsByTagNameNS('info:lc/xmlns/premis-v2', '*')).forEach(element => {
      if (Array.from(element.children).length) {
        return;
      }
      const label = element.localName;
      const index = (counters.get(label) || 0) + 1;
      counters.set(label, index);
      const key = `${label}:${index}`;
      const field = {
        key,
        label: Software.humanize(index === 1 ? label : `${label} (${index})`),
        value: element.textContent || ''
      };
      this.metadataElements.set(key, element);
      this.metadataFields.push(field);

      const parent = element.parentElement === premisRoot ? premisRoot : element.parentElement;
      if (!parent) {
        return;
      }
      let group = groups.get(parent);
      if (!group) {
        const rootLevel = parent === premisRoot;
        const groupName = parent.localName;
        const groupIndex = (groupCounters.get(groupName) || 0) + 1;
        groupCounters.set(groupName, groupIndex);
        group = {
          key: `${groupName}:${groupIndex}`,
          label: Software.humanize(groupIndex === 1 ? groupName : `${groupName} (${groupIndex})`),
          rootLevel,
          fields: []
        };
        groups.set(parent, group);
        this.metadataGroups.push(group);
      }
      group.fields.push(field);
    });
  }

  private static humanize(value: string): string {
    const text = value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/^./, character => character.toUpperCase());
    return text;
  }
}
