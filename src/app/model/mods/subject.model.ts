import ModsUtils from './utils';
import { ModsElement } from './element.model';

export class ModsSubject extends ModsElement {

    topic;
    geographic;
    temporal;

    static getSelector() {
        return 'subject';
    }

    static getId() {
        return 'subject';
    }

    constructor(modsElement) {
        super(modsElement, ['authority']);
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
        this.topic = this.modsElement['topic'][0];
        this.geographic = this.modsElement['geographic'][0];
        this.temporal = this.modsElement['temporal'][0];

    }

    toDC() {
        let dc = '';
        if (this.topic['_']) {
            dc += ModsUtils.dcEl('subject', this.topic['_']);
        }
        if (this.geographic['_']) {
            dc += ModsUtils.dcEl('subject', this.geographic['_']);
        }
        if (this.temporal['_']) {
            dc += ModsUtils.dcEl('subject', this.temporal['_']);
        }
        return dc;
    }

}
