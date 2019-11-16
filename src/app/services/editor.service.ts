import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { DocumentItem } from "../model/documentItem.model";
import { DocumentWrapper } from "../model/documentWrapper.model";

@Injectable()
export class EditorService {

    public state = 'none';
    private document: DocumentWrapper;

    constructor(
        private api: ApiService) {
    }

    init(params: EditorParams) {
        this.state = 'loading';
        const pid = params.pid;
        this.document = null;
        this.api.getDocument(pid).subscribe((item: DocumentItem) => {
            this.document = DocumentWrapper.fromDocumentItem(item);
            console.log('doc', this.document);
            this.state = 'success';
        }, error => {
            // TODO
        });
    }

    public goToParentObject() {
        console.log('goToParentObject');
    }

    public goToPreviousObject() {
        console.log('goToPreviousObject');
    }

    public goToNextObject() {
        console.log('goToNextObject');
    }

}

export interface EditorParams {
    pid: string;
}