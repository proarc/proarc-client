import { signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export class Utils {

    public static metadataChanged = signal<number>(0);

    public static clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    public static validateUUID(uuid: string): boolean {
        if (!uuid) {
            return false;
        }
        const  regexp = new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return regexp.test(uuid);
    } 

    public static mergeOrdered(top: string[], all: string[], translator: TranslateService, prefix: string): string[] {

        let rest =  all.filter(s => !top.includes(s));
        rest.sort((a: any, b: any) => {
            // const a1: string = this.translator.instant(this.data.prefix + '.' + a.toLocaleLowerCase()).toLocaleLowerCase();
            // const b1: string = this.translator.instant(this.data.prefix + '.' + b.toLocaleLowerCase()).toLocaleLowerCase();
            const a1: string = translator.instant(prefix + '.' + a).toLocaleLowerCase();
            const b1: string = translator.instant(prefix + '.' + b).toLocaleLowerCase();
            return a1.localeCompare(b1, 'cs')
        });
        return [...top, ...rest];

    }
    
}