import { FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ElementField } from "./elementField.model";

export abstract class ModsElement {
    public attrs: any;
    public modsElement: any;
    public collapsed = false;
    public hidden = false;
    private template;

    public validationWarning = false;
    private controls: Map<String, FormControl>;

    private subFields: ElementField[];

    constructor(modsElement: any, template: any, attributes: string[] = []) {
        this.validationWarning = false;
        this.subFields = [];
        this.controls = new Map<String, FormControl>();
        this.template = template;
        this.modsElement = modsElement;
        if (attributes.length > 0) {
            this.initAttributes(attributes);
        }
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
                this.modsElement['$'][attribute] = '';
            }
        }
        for (const attribute of attributes) {
            if (!this.modsElement['$'][attribute]) {
                this.modsElement['$'][attribute] = '';
            }
        }
        this.attrs = this.modsElement['$'];
    }

    public update() {

    }

    public switchCollapsed() {
        this.collapsed = !this.collapsed;
    }

    public isMandatory(field: any): boolean {
        return this.usage(field) == 'M' || this.required(field);
    }

    public required(field: string): boolean {
        return this.fieldValue(field, 'required');
    }

    public usage(field: string): string {
        return this.fieldValue(field, 'usage');
    }

    public label(field: string): string {
        return this.fieldValue(field, 'label');
    }

    public labelKey(field: string): string {
        return this.fieldValue(field, 'labelKey');
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
        return `<h3>${label} <i>${this.usage(field) || ''}</i> <code>${selector || ''}</code></h3>
        ${description || ''}`;
    }

    public showHelp(field: string): boolean {
        return this.fieldValue(field, 'help') != 'off';
    }

    public class(field: string): string {
        return "app-field-col app-field-col-" + (this.fieldValue(field, 'cols') || 1);
    }

    private fieldValue(field: string, key: string): any {
        if (field) {
            return this.template['fields'][field][key];
        } else {
            return this.template[key];
        }
    }

    public available(field: string): boolean {
        return !!(this.template['fields'] && this.template['fields'][field]);
    }

    public getTemplate() {
        return this.template;
    }

    public getField(field: string) {
        return this.template['fields'][field];
    }

    public getControl(field: string): FormControl {
        if (!this.controls.has(field)) {
            this.controls.set(field, new FormControl());
        }
        return this.controls.get(field);
    }

    public invalid(field: string): boolean {
        const c: any = this.getControl(field);
        if (c.touched && c.errors && c.errors.required) {
            return true;
        }
        return false;
    }

    public isRequired(): boolean {
        return this.template ? (this.template.usage == 'M' || this.template.required) : false;
        // return this.template ? (this.template.required) : false;
    }

    public validate(): boolean {
        // console.log(this.template)
        let error = false;
        let anyValue = false;
        let isRequired = this.isRequired();
        this.controls.forEach((value, key) => {
            value.markAsTouched();
            if (value.errors) {
                error = true;
            }
            if (value.value) {
                anyValue = true;
            }
        });

        if (!anyValue) {
            if (isRequired) {
                this.controls.forEach((value, key) => {
                    if (this.template.fields[key + ''] && (this.template.fields[key + ''].required || this.template.fields[key + ''].usage === 'M')) {
                        error = true;
                    }
                });
                // error = true;
            } else {
                this.controls.forEach((value, key) => {
                    // value.markAsUntouched();
                    if (this.template.fields[key + '']?.required) {
                        error = true;
                        isRequired = true;
                    } else {
                        value.markAsUntouched();
                    }
                });
            }
        }
        if (error && (isRequired || anyValue)) {
            this.validationWarning = true;
        } else {
            this.validationWarning = false;
        }
        return !this.validationWarning;
    }

    public isValid(): boolean {
        let error = false;
        let anyValue = false;
        const isRequired = this.template ? this.template.usage == 'M' : false
        this.controls.forEach((value, key) => {
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
        const keys = this.controls.keys();
        for (let key of keys) {
            // keys.forEach(( key: string) => {
            if (this.controls.get(key).dirty) {
                return true;
            }
            //});
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
        if (this.controls.size === 0) {
            this.subFields[0].getItems()[0].setAsDirty();
        } else {
            const keys = this.controls.keys();
            for (let key of keys) {
                this.controls.get(key).markAsDirty();
            }
        }
    }

    public resetChanges() {
        const keys = this.controls.keys();
        for (let key of keys) {
            this.controls.get(key).markAsPristine();
        }

        return false;
    }
}
