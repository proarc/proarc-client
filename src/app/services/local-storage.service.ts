
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    availableSearchColumns = ['name', 'pageType', 'pageIndex', 'pageNumber', 'model', 'pid', 'owner', 'processor', 'organization', 'status', 'created', 'modified', 'export', 'isLocked'];
    private searchColumnsDefaults: any = {
        'name': true,
        'pageType': true,
        'pageIndex': true,
        'pageNumber': true,
        'model': true,
        'pid': true,
        'processor': false,
        'organization': false,
        'status': false,
        'created': true,
        'modified': true,
        'owner': true,
        'export': true,
        'isLocked': true
    }

    constructor() {
    }

    isSearchColEnabled(col: string): boolean {
        return  this.getBoolProperty('search.cols.' + col, !!this.searchColumnsDefaults[col]);
    }

    getSearchColumns(): string|null {
        return localStorage.getItem('selectedColumns') || this.searchColumnsDefaults;
    }

    getStringProperty(property: string, defaultValue: string|null = null): string|null {
        return localStorage.getItem(property) || defaultValue;
    }

    setStringProperty(property: string, value: string) {
        return localStorage.setItem(property, value);
    }

    getBoolProperty(property: string, defaultValue: boolean = false) {
        const prop = this.getStringProperty(property);
        if (prop) {
            return prop === '1';
        } else {
            return defaultValue;
        }
    }

    setBoolProperty(property: string, value: boolean) {
        this.setStringProperty(property, value ? '1' : '0');
    }


}
