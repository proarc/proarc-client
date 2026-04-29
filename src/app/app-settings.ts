import { Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { Configuration } from './shared/configuration';
import json5 from "json5";
import { ApiService } from './services/api.service';

@Injectable({
    providedIn: 'root'
}) export class AppSettings {
    constructor(
        private http: HttpClient,
        public settings: Configuration,
        private api: ApiService
    ) { }

    

}
