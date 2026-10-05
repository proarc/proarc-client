export interface PremisElementTemplate {
  name: string;
  label?: string;
  max?: number;
  children?: PremisElementTemplate[];
}
export interface PremisTemplate { namespace?: string; elements: {[name: string]: PremisElementTemplate}; }
export interface PremisField {
  key: string;
  label: string;
  value: string;
  originalValue: string;
  node: Element | Attr;
}
export interface PremisGroup {
  key: string;
  label: string;
  node: Element;
  fields: PremisField[];
  children: PremisGroup[];
  template?: PremisElementTemplate;
  expanded: boolean;
}
const METS = 'http://www.loc.gov/METS/';

/** Preserve the complete METS DOM, including namespaces and unknown extensions. */
export class Premis {
  groups: PremisGroup[] = [];
  roots: PremisGroup[] = [];
  private document: Document;
  private baseline: string;
  private nextKey = 0;
  private addedRoots = new Map<Element, Element>();

  constructor(public xml: string, public timestamp: number, private template: PremisTemplate = {elements: {}}) {
    this.read();
    this.baseline = new XMLSerializer().serializeToString(this.document);
  }
  hasChanged(): boolean { return this.serialize() !== this.baseline; }
  restore(): void { this.read(); }
  serialize(): string {
    this.groups.forEach(group => group.fields.forEach(field => {
      const current = field.node.nodeType === Node.ATTRIBUTE_NODE ? (field.node as Attr).value : field.node.textContent;
      if (field.value !== current) {
        if (field.node.nodeType === Node.ATTRIBUTE_NODE) {
          (field.node as Attr).value = field.value;
        } else {
          field.node.textContent = field.value;
        }
      }
      // Missing scalar values are editable drafts; merely displaying them must not change the XML.
      if (field.node.nodeType === Node.ELEMENT_NODE && !field.node.parentNode && field.value !== '') {
        const item = this.fieldTemplate(group, field);
        if (item) { this.insertElement(group, item, field.node as Element); }
      }
    }));
    return new XMLSerializer().serializeToString(this.document);
  }
  availableElements(group: PremisGroup): PremisElementTemplate[] {
    return (group.template?.children || []).filter(item => !item.max ||
      Array.from(group.node.children).filter(child => child.localName === item.name &&
        child.namespaceURI === group.node.namespaceURI).length < item.max);
  }
  missingElements(group: PremisGroup): PremisElementTemplate[] {
    return this.availableElements(group).filter(item => item.children && !Array.from(group.node.children).some(child =>
      child.localName === item.name && child.namespaceURI === group.node.namespaceURI));
  }
  canAddField(group: PremisGroup, field: PremisField): boolean {
    const item = this.fieldTemplate(group, field);
    return !!item && (!item.max || group.fields.filter(candidate =>
      this.fieldTemplate(group, candidate) === item).length < item.max);
  }
  addFieldAfter(group: PremisGroup, field: PremisField): void {
    if (!this.groups.includes(group) || !group.fields.includes(field) || !this.canAddField(group, field)) { return; }
    const item = this.fieldTemplate(group, field);
    if (!field.node.parentNode) { this.insertElement(group, item, field.node as Element); }
    this.addElement(group, item, field.node as Element);
  }
  fieldTemplate(group: PremisGroup, field: PremisField): PremisElementTemplate | undefined {
    if (field.node.nodeType !== Node.ELEMENT_NODE || field.node === group.node) { return undefined; }
    const element = field.node as Element;
    return element.namespaceURI === group.node.namespaceURI
      ? group.template?.children?.find(item => item.name === element.localName) : undefined;
  }
  canAddGroup(group: PremisGroup): boolean {
    if (!this.groups.includes(group) || !group.template) { return false; }
    const parent = this.groups.find(candidate => candidate.children.includes(group));
    if (parent) { return this.availableElements(parent).includes(group.template); }
    if (!this.metadataSection(group.node)) { return false; }
    return !group.template.max || Array.from(group.node.parentElement.children).filter(child =>
      child.localName === group.node.localName && child.namespaceURI === group.node.namespaceURI).length < group.template.max;
  }
  addGroupAfter(group: PremisGroup): void {
    if (!this.canAddGroup(group)) { return; }
    const parent = this.groups.find(candidate => candidate.children.includes(group));
    if (parent) {
      this.addElement(parent, group.template, group.node);
    } else {
      // Keep namespace declarations and xsi:type, but start with empty values.
      const element = group.node.cloneNode(false) as Element;
      Array.from(element.attributes).filter(attr =>
        !['http://www.w3.org/2000/xmlns/', 'http://www.w3.org/2001/XMLSchema-instance'].includes(attr.namespaceURI)
      ).forEach(attr => element.removeAttributeNode(attr));
      const section = this.metadataSection(group.node);
      const prefix = ({agent: 'AGENT', event: 'EVENT', object: 'OBJ'} as {[name: string]: string})[group.node.localName];
      let container = element;
      if (section && prefix) {
        // Each top-level entity gets its own METS metadata section, including a unique ID.
        let ancestor = group.node.parentElement;
        while (ancestor) {
          const shell = ancestor.cloneNode(false) as Element;
          shell.removeAttribute('ID');
          shell.appendChild(container);
          container = shell;
          if (ancestor === section) { break; }
          ancestor = ancestor.parentElement;
        }
        container.setAttribute('ID', this.nextMetadataId(prefix));
        const sameType = this.roots.filter(candidate => candidate.node.localName === group.node.localName &&
          candidate.node.namespaceURI === group.node.namespaceURI &&
          this.metadataSection(candidate.node)?.parentElement === section.parentElement);
        const lastSection = this.metadataSection(sameType[sameType.length - 1].node);
        section.parentNode.insertBefore(container, lastSection.nextSibling);
      } else { return; }
      this.addedRoots.set(element, container);
      const sibling = this.readGroup(element, group.template);
      sibling.label = this.rootLabel(element, sibling.label);
      const nextIndex = this.roots.findIndex(candidate =>
        !!(element.compareDocumentPosition(candidate.node) & Node.DOCUMENT_POSITION_FOLLOWING));
      this.roots.splice(nextIndex < 0 ? this.roots.length : nextIndex, 0, sibling);
    }
  }
  addElement(group: PremisGroup, item: PremisElementTemplate, after?: Element): void {
    if (!this.groups.includes(group) || !this.availableElements(group).includes(item)) { return; }
    if (after && (after.parentElement !== group.node || after.localName !== item.name ||
        after.namespaceURI !== group.node.namespaceURI)) { return; }
    const draft = !item.children ? group.fields.find(field => !field.node.parentNode &&
      this.fieldTemplate(group, field) === item) : undefined;
    const element = draft ? draft.node as Element : this.createElement(group.node, item.name);
    this.insertElement(group, item, element, after);
    if (item.children) {
      const child = this.readGroup(element, item);
      const nextIndex = after ? group.children.findIndex(existing => existing.node === after) + 1
        : group.children.findIndex(existing => !!(element.compareDocumentPosition(existing.node) & Node.DOCUMENT_POSITION_FOLLOWING));
      group.children.splice(nextIndex < 0 ? group.children.length : nextIndex, 0, child);
    } else if (!draft) {
      const field = this.readField(element, item.label || Premis.humanize(item.name));
      const afterIndex = group.fields.findIndex(existing => existing.node === after);
      group.fields.splice(afterIndex < 0 ? group.fields.length : afterIndex + 1, 0, field);
    }
  }
  removeField(group: PremisGroup, field: PremisField): void {
    if (!this.groups.includes(group) || !group.fields.includes(field) || field.node.nodeType !== Node.ELEMENT_NODE ||
        field.node === group.node) { return; }
    if (field.node.parentNode) { field.node.parentNode.removeChild(field.node); }
    group.fields.splice(group.fields.indexOf(field), 1);
    this.ensureScalarFields(group);
  }
  removeGroup(group: PremisGroup): void {
    // Keep top-level entities and METS wrappers carrying external references.
    const parent = this.groups.find(candidate => candidate.children.includes(group));
    if (!parent && !this.addedRoots.has(group.node)) { return; }
    const container = this.addedRoots.get(group.node) || group.node;
    container.parentNode.removeChild(container);
    if (parent) {
      parent.children.splice(parent.children.indexOf(group), 1);
    } else {
      this.roots.splice(this.roots.indexOf(group), 1);
      this.addedRoots.delete(group.node);
    }
    const remove = (item: PremisGroup) => {
      item.children.forEach(remove);
      this.groups.splice(this.groups.indexOf(item), 1);
    };
    remove(group);
  }
  canRemoveGroup(group: PremisGroup): boolean {
    return this.addedRoots.has(group.node) || this.groups.some(parent => parent.children.includes(group));
  }
  private read(): void {
    this.document = new DOMParser().parseFromString(this.xml, 'application/xml');
    if (this.document.getElementsByTagName('parsererror').length ||
        this.document.documentElement.localName !== 'mets' || this.document.documentElement.namespaceURI !== METS) {
      throw new Error('Invalid PREMIS METS document');
    }
    this.groups = [];
    this.roots = [];
    this.addedRoots.clear();
    const visit = (element: Element, ids: string[]) => {
      const context = element.hasAttribute('ID') ? [...ids, element.getAttribute('ID')] : ids;
      if (element.namespaceURI !== METS) {
        const definition = element.namespaceURI === (this.template.namespace || 'info:lc/xmlns/premis-v2')
          ? this.template.elements[element.localName] : undefined;
        const group = this.readGroup(element, definition);
        group.label = [...context, group.label].join(' / ');
        this.roots.push(group);
      } else {
        Array.from(element.children).forEach(child => visit(child, context));
      }
    };
    visit(this.document.documentElement, []);
  }
  private metadataSection(element: Element): Element | undefined {
    const xmlData = element.parentElement;
    const mdWrap = xmlData?.parentElement;
    const section = mdWrap?.parentElement;
    const amdSec = section?.parentElement;
    if (xmlData?.namespaceURI !== METS || xmlData.localName !== 'xmlData' ||
        mdWrap?.namespaceURI !== METS || mdWrap.localName !== 'mdWrap' ||
        section?.namespaceURI !== METS || !['techMD', 'digiprovMD'].includes(section.localName) ||
        amdSec?.namespaceURI !== METS || amdSec.localName !== 'amdSec') { return undefined; }
    return section;
  }
  private nextMetadataId(prefix: string): string {
    let maximum = 0;
    let width = 3;
    const pattern = new RegExp(`^${prefix}_(\\d+)$`);
    Array.from(this.document.getElementsByTagName('*')).forEach(element => {
      const match = pattern.exec(element.getAttribute('ID') || '');
      if (match) {
        maximum = Math.max(maximum, Number(match[1]));
        width = Math.max(width, match[1].length);
      }
    });
    return `${prefix}_${String(maximum + 1).padStart(width, '0')}`;
  }
  private rootLabel(element: Element, label: string): string {
    const ids: string[] = [];
    let ancestor = element;
    while (ancestor) {
      if (ancestor.hasAttribute('ID')) { ids.unshift(ancestor.getAttribute('ID')); }
      ancestor = ancestor.parentElement;
    }
    return [...ids, label].join(' / ');
  }
  private readGroup(element: Element, definition?: PremisElementTemplate): PremisGroup {
    const group: PremisGroup = {key: `group-${this.nextKey++}`, label: definition?.label || Premis.humanize(element.localName),
      node: element, fields: [], children: [], template: definition, expanded: true};
    this.groups.push(group);
    Array.from(element.attributes).filter(attr =>
      !['http://www.w3.org/2000/xmlns/', 'http://www.w3.org/2001/XMLSchema-instance'].includes(attr.namespaceURI)
    ).forEach(attr => group.fields.push(this.readField(attr, `@${attr.name}`)));
    Array.from(element.children).forEach(child => {
      const item = child.namespaceURI === element.namespaceURI
        ? definition?.children?.find(candidate => candidate.name === child.localName) : undefined;
      const editableAttributes = Array.from(child.attributes).some(attr =>
        !['http://www.w3.org/2000/xmlns/', 'http://www.w3.org/2001/XMLSchema-instance'].includes(attr.namespaceURI));
      if (child.children.length || item?.children || editableAttributes) {
        group.children.push(this.readGroup(child, item));
      } else {
        group.fields.push(this.readField(child, item?.label || Premis.humanize(child.localName)));
      }
    });
    if (!element.children.length && !definition?.children) {
      group.fields.push(this.readField(element, Premis.humanize(element.localName)));
    }
    this.ensureScalarFields(group);
    return group;
  }
  private ensureScalarFields(group: PremisGroup): void {
    (group.template?.children || []).filter(item => !item.children).forEach(item => {
      if (!group.fields.some(field => this.fieldTemplate(group, field) === item) &&
          !group.children.some(child => child.template === item)) {
        group.fields.push(this.readField(this.createElement(group.node, item.name), item.label || Premis.humanize(item.name)));
      }
    });
  }
  private createElement(parent: Element, name: string): Element {
    return this.document.createElementNS(parent.namespaceURI, parent.prefix ? `${parent.prefix}:${name}` : name);
  }
  private insertElement(group: PremisGroup, item: PremisElementTemplate, element: Element, after?: Element): void {
    const definitions = group.template.children;
    const index = definitions.indexOf(item);
    const next = Array.from(group.node.children).find(child => child.namespaceURI === group.node.namespaceURI &&
      definitions.findIndex(definition => definition.name === child.localName) > index);
    group.node.insertBefore(element, after ? after.nextSibling : next || null);
  }
  private readField(node: Element | Attr, label: string): PremisField {
    const value = node.nodeType === Node.ATTRIBUTE_NODE ? (node as Attr).value : node.textContent || '';
    return {key: `field-${this.nextKey++}`, label, value, originalValue: value, node};
  }
  static humanize(name: string): string {
    return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, character => character.toUpperCase());
  }
}
