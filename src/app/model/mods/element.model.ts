import { FormControl } from "@angular/forms";
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
        return this.usage(field) == 'M';
    }

    public usage(field: string): string {
        return this.fieldValue(field, 'usage');
    }

    public label(field: string): string {
        return this.fieldValue(field, 'label');
    }

    public options(field: string): string[] {
        return this.fieldValue(field, 'options');
    }

    public help(field: string): string {
        const description = this.fieldValue(field, 'description');
        const selector = this.fieldValue(field, 'selector');
        return `<h3>${this.label(field) } <i>${this.usage(field) || ''}</i> <code>${selector || ''}</code></h3>
        ${description || '' }`;
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

    public getControl(filed: string): FormControl {
        if (!this.controls.has(filed)) {
            this.controls.set(filed, new FormControl());
        }
        return this.controls.get(filed);
    }

    public invalid(field: string): boolean {
        const c: any = this.getControl(field);
        if (c.touched && c.errors && c.errors.required) {
            return true;
        }
        return false;
    }

    public validate(): boolean {
        let error = false;
        let anyValue = false;
        const isRequired = this.template ? this.template.usage == 'M' : false
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
            if(isRequired) {
                this.controls.forEach((value, key) => {
                    if (this.template.fields[key+''].usage === 'M') {
                        error = true;
                    }
                });
                // error = true;
            } else {
                this.controls.forEach((value, key) => {
                    value.markAsUntouched();
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
        return !(error && (isRequired|| anyValue));
    }
}
