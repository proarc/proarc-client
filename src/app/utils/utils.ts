import { signal } from "@angular/core";

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
}