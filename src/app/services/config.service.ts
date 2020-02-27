
import { Injectable } from '@angular/core';

declare var APP_GLOBAL: any;

@Injectable()
export class ConfigService {

    public proarcBackendUrl = APP_GLOBAL.proarc_backend_url;

    constructor() {
    }

}
