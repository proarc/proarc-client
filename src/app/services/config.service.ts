
import { Injectable } from '@angular/core';

declare var APP_GLOBAL: any;

@Injectable()
export class ConfigService {

    public proarcBackendUrl = APP_GLOBAL.proarcUrl;
    public allModels = APP_GLOBAL.models;
    public defaultModel = APP_GLOBAL.defaultModel;

    constructor() {
    }

}
