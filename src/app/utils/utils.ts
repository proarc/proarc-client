import { signal } from "@angular/core";

export class Utils {

    public static metadataChanged = signal<number>(0);

    public static clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}