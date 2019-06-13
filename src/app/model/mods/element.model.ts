
export abstract class ModsElement {
    public attrs;
    public modsElement;

    constructor(modsElement, attributes: string[] = []) {
        this.modsElement = modsElement;
        if (attributes.length > 0) {
            this.initAttributes(attributes);
        }
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

    public abstract toDC(): string;

    public update() {

    }

}
