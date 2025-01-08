import { Injectable } from "@angular/core";
import { Configuration } from "./configuration";
import { ApiService } from "../services/api.service";

@Injectable()
export class UserSettings {
    searchModel: string;


    [key: string]: any; // This is to allow property asignement by name this[k] = o[k];

    constructor(
        private api: ApiService,
        private config: Configuration) {
        this.searchModel = this.config.defaultModel
    }

    load(o: any) {
        const keys = Object.keys(o);
        keys.forEach(k => {
            this[k] = o[k];
        });
    }

    save() {

    }
}