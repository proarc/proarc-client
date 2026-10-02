import {ElementField} from './elementField.model';
import {ModsRole} from './role.model';
import {ModsElement} from './element.model';
import {ModsNamePart} from './namePart.model';

export class ModsAgent extends ModsElement {

  public roleTerm: ElementField;
  public nameParts: ElementField;


  static getSelector() {
    return 'agent';
  }

  static getId() {
    return 'agent';
  }

  constructor(modsElement: any, template: any) {
    super(modsElement, template, []);
    this.init();
  }

  private init() {

    if (this.available2('namePart')) {

      if (!this.modsElement['namePart']) {
        this.modsElement['namePart'] = [];
      }
      this.nameParts = new ElementField(this.modsElement, ModsNamePart.getSelector(), this.getField('namePart'));
      this.addSubfield(this.nameParts);
      this.addControl('namePart');
    }

    if (this.available2('role')) {
      this.roleTerm = new ElementField(this.modsElement, ModsRole.getSelector(), this.getField('role'));
      this.addSubfield(this.roleTerm);
    }
  }

}
