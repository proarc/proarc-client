import {ModsElement} from './element.model';
import {ElementField} from './elementField.model';
import {ModsPart} from './part.model';
import {ModsTitle} from './title.model';
import {ModsPublisher} from './publisher.model';

export class ModsRelatedItem2 extends ModsElement {

  titleInfos: ElementField;
  originInfos: ElementField;
  parts: ElementField;

  static getSelector() {
    return 'relatedItem';
  }

  static getId() {
    return 'relatedItem';
  }

  constructor(modsElement: any, template: any) {
    super(modsElement, template, ['type']);
    this.init();
  }

  private init() {
    this.addControl('type');

    if (this.available2('titleInfo')) {
      this.titleInfos = new ElementField(this.modsElement, ModsTitle.getSelector(), this.getField('titleInfo'));
      this.addSubfield(this.titleInfos);
      this.addControl('titleInfo');
    }

    if (this.available2('originInfo')) {
      this.originInfos = new ElementField(this.modsElement, ModsPublisher.getSelector(), this.getField('originInfo'));
      this.addSubfield(this.originInfos);
      this.addControl('originInfo');
    }

    if (this.available2('part')) {
      this.parts = new ElementField(this.modsElement, ModsPart.getSelector(), this.getField('part'));
      this.addSubfield(this.parts);
      this.addControl('part');
    }
  }
}
