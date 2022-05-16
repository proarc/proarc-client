import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsCartographics } from './cartographics.model';

export class ModsSubject extends ModsElement {

    topic;
    geographic;
    temporal;
    name;

    public cartographics: ElementField;


    static getSelector() {
        return 'subject';
    }

    static getId() {
        return 'subject';
    }

    constructor(modsElement, template) {
        super(modsElement, template, ['authority', 'lang']);
        this.init();
    }

    private init() {
        if (!this.modsElement['topic']) {
            this.modsElement['topic'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['geographic']) {
            this.modsElement['geographic'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['temporal']) {
            this.modsElement['temporal'] = ModsUtils.createEmptyField();
        }
        if (!this.modsElement['name']) {
            this.modsElement['name'] = ModsUtils.createEmptyField();
        }
        this.topic = this.modsElement['topic'][0];
        this.geographic = this.modsElement['geographic'][0];
        this.temporal = this.modsElement['temporal'][0];
        this.name = this.modsElement['name'][0];

        if(this.available('cartographics')) {
            this.cartographics = new ElementField(this.modsElement, ModsCartographics.getSelector(), this.getField('cartographics'));
            this.addSubfield(this.cartographics);
        }

    }

}
