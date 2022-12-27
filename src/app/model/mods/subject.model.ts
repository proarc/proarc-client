import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsCartographics } from './cartographics.model';
import {ModsAuthor} from './author.model';

export class ModsSubject extends ModsElement {

    topic: any;
    geographic: any;
    temporal: any;
    public names: ElementField;
    public cartographics: ElementField;


    static getSelector() {
        return 'subject';
    }

    static getId() {
        return 'subject';
    }

    constructor(modsElement: any, template: any) {
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
        // if (!this.modsElement['name']) {
        //     this.modsElement['name'] = [{}];
        // }
        // if (!this.modsElement['name'][0]) {
        //     this.modsElement['name'][0] = {};
        // }
        // if (!this.modsElement['name'][0]['namePart']) {
        //     this.modsElement['name'][0]['namePart'];
        // }
        // if (!this.modsElement['name'][0]['namePart']) {
        //     this.modsElement['name'][0]['namePart'] = ModsUtils.createEmptyField();
        // }
        this.topic = this.modsElement['topic'][0];
        this.geographic = this.modsElement['geographic'][0];
        this.temporal = this.modsElement['temporal'][0];

        if (this.available('name')) {
            this.names = new ElementField(this.modsElement, ModsAuthor.getSelector(), this.getField('name'));
            this.addSubfield(this.names);
        }


        if(this.available('cartographics')) {
            this.cartographics = new ElementField(this.modsElement, ModsCartographics.getSelector(), this.getField('cartographics'));
            this.addSubfield(this.cartographics);
        }

    }

}
