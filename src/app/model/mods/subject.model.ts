import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsCartographics } from './cartographics.model';
import {ModsAuthor} from './author.model';
import {ModsGeographicCode} from './ModsGeographicCode.model';
import {ModsTopic} from './topic.model';
import {ModsTitle} from './title.model';

export class ModsSubject extends ModsElement {

    // topic: any;
    geographic: any;
    temporal: any;
    occupation: any;
    public names: ElementField;
    public cartographics: ElementField;
    public geographicCodes: ElementField;
    public topics: ElementField;
    public titleInfos: ElementField;


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
        
        this.addControl('authority');
        this.addControl('lang');

        if (!this.modsElement['geographic']) {
            this.modsElement['geographic'] = ModsUtils.createField(this, 'geographic');
        }
        this.addControl('geographic');

        if (!this.modsElement['temporal']) {
            this.modsElement['temporal'] = ModsUtils.createField(this, 'temporal');
        }
        this.addControl('temporal');

        if (!this.modsElement['occupation']) {
            this.modsElement['occupation'] = ModsUtils.createField(this, 'occupation');
        }
        this.addControl('occupation');

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
        // this.topic = this.modsElement['topic'][0];
        this.geographic = this.modsElement['geographic'][0];
        this.temporal = this.modsElement['temporal'][0];
        this.occupation = this.modsElement['occupation'][0];

        if (this.available2('name')) {
            this.names = new ElementField(this.modsElement, ModsAuthor.getSelector(), this.getField('name'));
            this.addSubfield(this.names);
        }
        if (this.available2('topic')) {
          this.topics = new ElementField(this.modsElement, ModsTopic.getSelector(), this.getField('topic'));
          this.addSubfield(this.topics);
        }
        if (this.available2('titleInfo')) {
          this.titleInfos = new ElementField(this.modsElement, ModsTitle.getSelector(), this.getField('titleInfo'));
          this.addSubfield(this.titleInfos);
        }


        if(this.available2('cartographics')) {
            this.cartographics = new ElementField(this.modsElement, ModsCartographics.getSelector(), this.getField('cartographics'));
            this.addSubfield(this.cartographics);
        }

        if(this.available2('geographicCode')) {
          this.geographicCodes = new ElementField(this.modsElement, ModsGeographicCode.getSelector(), this.getField('geographicCode'));
          this.addSubfield(this.geographicCodes);
        }

    }

}
