import { ElementField } from './elementField.model';
import { ModsRole } from './role.model';
import { ModsElement } from './element.model';
import ModsUtils from './utils';
import {ModsFrequency} from './frequency.model';
import {ModsNamePart} from './namePart.model';

export class ModsTopic extends ModsElement {

    static getSelector() {
        return 'topic';
    }

    static getId() {
        return 'topic';
    }

    constructor(modsElement: any, template: any) {
        super(modsElement, template, ['lang']);
        this.init();
    }


    private init() {

    }

}
