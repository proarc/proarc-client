import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import {ModsPart} from './part.model';
import {ModsTitle} from './title.model';
import {ModsAuthor} from './author.model';
import {ModsPublisher} from './publisher.model';
import ModsUtils from './utils';

export class ModsRelatedItem extends ModsElement {

    parts: ElementField;
    titleInfos: ElementField;
    names: ElementField;
    originInfos: ElementField;

    static getSelector() {
        return 'relatedItem';
    }

    static getId() {
        return 'relatedItem';
    }

    constructor(modsElement, template) {
        super(modsElement, template);
        this.init();
    }

    private init() {
        if (this.available('part')) {
            this.parts = new ElementField(this.modsElement, ModsPart.getSelector(), this.getField('part'));
            this.addSubfield(this.parts);
        }
        if (this.available('titleInfo')) {
            this.titleInfos = new ElementField(this.modsElement, ModsTitle.getSelector(), this.getField('titleInfo'));
            this.addSubfield(this.titleInfos);
        }
        if (this.available('name')) {
            this.names = new ElementField(this.modsElement, ModsAuthor.getSelector(), this.getField('name'));
            this.addSubfield(this.names);
        }
        if (this.available('originInfo')) {
            this.originInfos = new ElementField(this.modsElement, ModsPublisher.getSelector(), this.getField('originInfo'));
            this.addSubfield(this.originInfos);
        }
    }
}
