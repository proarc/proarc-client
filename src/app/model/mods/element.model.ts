import { FormControl, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ElementField } from "./elementField.model";
import ModsUtils from './utils';
import { Utils } from "../../utils/utils";

export abstract class ModsElement {
    public attrs: any;
    public modsElement: any;
    public collapsed = false;
    public hidden = false;
    public template;

    public isRequired: boolean;

    public validationWarning = false;
    public controls: { [key: string]: FormControl } = {};
    public clazz: { [key: string]: string } = {};
    public isMandatory: { [key: string]: boolean } = {};
    public usage: { [key: string]: string } = {};
    public hasHelp: { [key: string]: boolean } = {};
    public available: { [key: string]: boolean } = {};
    public labelKey: { [key: string]: string } = {};

    private subFields: ElementField[];

    constructor(modsElement: any, template: any, attributes: string[] = []) {
        this.validationWarning = false;
        this.subFields = [];
        //this.controls = new Map<String, FormControl>();
        this.template = template;
        this.modsElement = modsElement;
        if (attributes.length > 0) {
            this.initAttributes(attributes);
        }
        this.isRequired = this.isRequired2();
    }

    public addSubfield(field: ElementField) {
        this.subFields.push(field);
    }

    public getSubfields(): ElementField[] {
        return this.subFields;
    }

    public getEl() {
        return this.modsElement;
    }

    private initAttributes(attributes: string[]) {
        if (!this.modsElement['$']) {
            this.modsElement['$'] = {};
            for (const attribute of attributes) {
                if (attribute) {
                    this.modsElement['$'][attribute] = ModsUtils.getDefaultValue(this, attribute);
                }
            }
        }
        for (const attribute of attributes) {
            if (!this.modsElement['$'][attribute]) {
                if (attribute) {
                    this.modsElement['$'][attribute] = ModsUtils.getDefaultValue(this, attribute);
                }
            }
        }
        this.attrs = this.modsElement['$'];
    }

    public update() {

    }

    public switchCollapsed() {
        this.collapsed = !this.collapsed;
    }

    public isMandatory2(field: any): boolean {
        return this.usage2(field) == 'M' || this.required(field);
    }

    public required(field: string): boolean {
        return this.template['fields'][field] && this.template['fields'][field]['required'];
    }

    public usage2(field: string): string {
        let u = '';
        if (field && this.template['fields'][field] && this.template['fields'][field]['usage']) {
            u = this.template['fields'][field]['usage'];
        }
        return u;
    }

    public label(field: string): string {
        return this.fieldValue(field, 'label');
    }

    public labelKey2(field: string): string {
        if (field && this.template['fields'][field] && this.template['fields'][field]['labelKey']) {
            return this.template['fields'][field]['labelKey'];
        } else {
            return '';
        }

    }

    public selector(field: string): string {
        return this.fieldValue(field, 'selector');
    }

    public options(field: string): string[] {
        return this.fieldValue(field, 'options');
    }

    public help(field: string, translator: TranslateService): string {
        const description = this.fieldValue(field, 'description');
        const selector = this.fieldValue(field, 'selector');
        const labelKey = this.fieldValue(field, 'labelKey');
        const label = translator.instant('mods.' + labelKey);
        return `<h3>${label} <i>${this.usage2(field) || ''}</i> <code>${selector || ''}</code></h3>
        ${description || ''}`;
    }

    public showHelp(field: string): boolean {
        let ret = true;
        if (field && this.template['fields'][field] && this.template['fields'][field]['help']) {
            ret = this.template['fields'][field]['help'] != 'off';
        }
        return ret;
    }

    public class(field: string): string {
        let cols = '1';
        if (field && this.template['fields'][field] && this.template['fields'][field]['cols']) {
            cols = this.template['fields'][field]['cols'];
        }
        return "app-field-col app-field-col-" + cols;
    }

    private fieldValue(field: string, key: string): any {
        if (field) {
            // if (field && this.template['fields'][field] && this.template['fields'][field][key]) {
            return this.template['fields'][field][key];
        } else {
            return this.template[key];
        }
    }

    public available2(field: string): boolean {
        this.available[field] = !!(this.template['fields'] && this.template['fields'][field]);
        return this.available[field];
    }

    public getTemplate() {
        return this.template;
    }

    public getField(field: string) {
        return this.template['fields'][field];
    }

    public addControl(field: string, modsElement: string = null) {
        const me = modsElement ? modsElement as keyof (ModsElement) :  field as keyof (ModsElement);
        
        this.clazz[field] = this.class(field);
        this.isMandatory[field] = this.isMandatory2(field);
        this.usage[field] = this.usage2(field);
        this.hasHelp[field] = this.showHelp(field);
        this.available[field] = this.available2(field);
        this.labelKey[field] = this.labelKey2(field);

        if (!this.controls.hasOwnProperty(field)) {
            const c = new FormControl('');
                if (this[me]) {
                    c.patchValue(this[me]['_']);
                    c.valueChanges.subscribe((e: any) => {
                        this[me]['_'] = e;
                        Utils.metadataChanged.update(n => n + 1);
                    });
                } else if (this.modsElement[me]) {
                    c.patchValue(this.modsElement[me]);
                    c.valueChanges.subscribe((e: any) => {
                        this.modsElement[me] = e;
                        Utils.metadataChanged.update(n => n + 1);
                        
                    });
                } else if (this.attrs?.hasOwnProperty(field)) {
                c.patchValue(this.attrs[field]);
                c.valueChanges.subscribe((e: any) => {
                    this.attrs[field] = e;
                    Utils.metadataChanged.update(n => n + 1);
                });
            }

            this.controls[field] = c;
            // console.log('ADD ' + field + ' -> ' + this.labelKey2(field));
        }
        if (field === 'nonSort') {

        }
    }

    public getControl2(field: string): FormControl {
        // if (!this.controls.hasOwnProperty(field)) {
        //     const c = new FormControl();
        //     if (this[field as keyof(ModsElement)]) {
        //         c.setValue(this[field as keyof(ModsElement)]['_']);
        //     }

        //     this.controls[field] = c;
        // }
        return this.controls[field];
    }

    public invalid(field: string): boolean {
        const c: any = this.getControl2(field);
        if (!c) {
            console.log(field, this)
        }
        if (c.touched && c.errors && c.errors.required) {
            return true;
        }
        return false;
    }

    public isRequired2(): boolean {
        return this.template ? (this.template.usage === 'M' || this.template.required === true) : false;
    }

    public hasAnyValue(): boolean {
        let anyValue = false;
        Object.keys(this.controls).forEach((key) => {
            const value = this.controls[key];
            if (value.value) {
                anyValue = true;
            }
        });
        return anyValue;
    }

    public validate(parent: ModsElement = null): boolean {
        // console.log(this.template)
        let error = false;
        let anyValue = false;
        let isRequired = this.isRequired;
        this.validationWarning = false;
        Object.keys(this.controls).forEach((key) => {
            const value = this.controls[key];
            if (value.errors) {
                error = true;
                value.markAsTouched();
            }
            if (value.value) {
                anyValue = true;
            }
        });

        if (!anyValue) {
            if (isRequired) {
                Object.keys(this.controls).forEach((key) => {
                    const value = this.controls[key];
                    if (this.template.fields[key + ''] &&
                        (this.template.fields[key + ''].required || this.template.fields[key + ''].usage === 'M') &&
                        !value.value) {
                      // uprava kvuli issue 627
                      if (parent === null && this.template.fields[key + ''].selector === 'genre/value' && this.template.isElectronicArticle === true) {
                        error = false;
                      } else {
                        error = true;
                        value.markAsTouched();
                        if (parent && (parent.isRequired || parent.hasAnyValue()) ) {
                          parent.collapsed = false;
                        }
                        this.collapsed = false;
                      }
                    }
                });
                // error = true;
            } else {
                Object.keys(this.controls).forEach((key) => {
                    const value = this.controls[key];
                    if (this.template.fields[key + '']?.required && !value.value) {
                        error = true;
                        value.markAsTouched();
                        // if (parent) {
                        //   parent.collapsed = false;
                        // }
                        // this.collapsed = false;
                    } else {
                        value.markAsUntouched();
                    }
                });
            }
        }
        if (error && (isRequired || anyValue)) {
            this.validationWarning = true;
            this.collapsed = false;
        } else {
            this.validationWarning = false;
        }

        for (const subfield of this.getSubfields()) {
            for (const item2 of subfield.getItems()) {
                item2.validate(this)
            }
        }

        return !this.validationWarning;
    }

    public isValid(): boolean {
        let error = false;
        let anyValue = false;
        const isRequired = this.template ? this.template.usage == 'M' : false
        Object.keys(this.controls).forEach((key) => {
            const value = this.controls[key];
            if (value.errors) {
                error = true;
            }
            if (value.value) {
                anyValue = true;
            }
        });

        if (!anyValue && isRequired) {
            error = true;
        }
        return !(error && (isRequired || anyValue));
    }

    public hasChanges(): boolean {
        const keys = Object.keys(this.controls);
        for (let key of keys) {
            if (this.controls[key].dirty) {
                return true;
            }
        }

        for (const subfield of this.getSubfields()) {
            for (const item2 of subfield.getItems()) {
                if (item2.hasChanges()) {
                    return true;
                }
            }
        }

        return false;
    }

    public setAsDirty() {
        if (Object.keys(this.controls).length === 0) {
            this.subFields[0].getItems()[0].setAsDirty();
        } else {
            const keys = Object.keys(this.controls);
            for (let key of keys) {
                this.controls[key].markAsDirty();
            }
        }
    }

    public resetChanges() {
        const keys = Object.keys(this.controls);
        for (let key of keys) {
            this.controls[key].markAsPristine();
        }

        return false;
    }
}
