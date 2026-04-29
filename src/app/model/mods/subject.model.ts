import ModsUtils from './utils';
import { ModsElement } from './element.model';
import { ElementField } from './elementField.model';
import { ModsCartographics } from './cartographics.model';
import {ModsAuthor} from './author.model';
import {ModsGeographicCode} from './ModsGeographicCode.model';
import {ModsTopic} from './topic.model';
import {ModsTitle} from './title.model';
import {ModsTemporal} from './temporal.model';
import {ModsGeographic} from './geographic.model';

export class ModsSubject extends ModsElement {

    // topic: any;
    // geographic: any;
    occupation: any;
    public temporals: ElementField;
    public geographics: ElementField;
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

        if (!this.modsElement['occupation']) {
            this.modsElement['occupation'] = ModsUtils.createField(this, 'occupation');
        }
        this.addControl('occupation');

        this.occupation = this.modsElement['occupation'][0];

        if (this.available2('name')) {
            this.names = new ElementField(this.modsElement, ModsAuthor.getSelector(), this.getField('name'));
            this.addSubfield(this.names);
            this.addControl('name');
        }
        if (this.available2('topic')) {
          this.topics = new ElementField(this.modsElement, ModsTopic.getSelector(), this.getField('topic'));
          this.addSubfield(this.topics);
          this.addControl('topic');
        }
        if (this.available2('temporal')) {
          this.temporals = new ElementField(this.modsElement, ModsTemporal.getSelector(), this.getField('temporal'));
          this.addSubfield(this.temporals);
          this.addControl('temporal', '_');
        }

        if (this.available2('geographic')) {
          this.geographics = new ElementField(this.modsElement, ModsGeographic.getSelector(), this.getField('geographic'));
          this.addSubfield(this.geographics);
          this.addControl('geographic');
        }
        
        if (this.available2('titleInfo')) {
          this.titleInfos = new ElementField(this.modsElement, ModsTitle.getSelector(), this.getField('titleInfo'));
          this.addSubfield(this.titleInfos);
          this.addControl('titleInfo');
        }


        if(this.available2('cartographics')) {
            this.cartographics = new ElementField(this.modsElement, ModsCartographics.getSelector(), this.getField('cartographics'));
            this.addSubfield(this.cartographics);
            this.addControl('cartographics');
        }

        if(this.available2('geographicCode')) {
          this.geographicCodes = new ElementField(this.modsElement, ModsGeographicCode.getSelector(), this.getField('geographicCode'));
          this.addSubfield(this.geographicCodes);
          this.addControl('geographicCode');
        }

    }

}
