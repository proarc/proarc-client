import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { EditorService } from 'src/app/services/editor.service';
import { Page } from 'src/app/model/page.model';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrls: ['./editor-page.component.scss']
})
export class EditorPageComponent implements OnInit {

  state = 'none';
  page: Page;

  pageTypes = [
    "NormalPage", 
    "abstract",
    "anotation",
    "bibliography",
    "bibliographicalPortrait",
    "booklet",
    "colophon",
    "dedication", 
    "cover",
    "appendix",
    "editorial",
    "errata",
    "frontispiece",
    "mainArticle",
    "spine",
    "illustration",
    "imgDisc",
    "impressum",
    "interview",
    "calibrationTable",
    "map",
    "normalPage",
    "sheetmusic",
    "obituary",
    "tableOfContents",
    "edge",
    "case",
    "imprimatur",
    "blank",
    "jacket",
    "preface",
    "frontCover",
    "frontEndPaper",
    "frontEndSheet",
    "frontJacket",
    "index",
    "advertisement",
    "review",
    "listOfIllustrations",
    "listOfMaps",
    "listOfSupplements",
    "listOfTables",
    "table",
    "titlePage",
    "introduction",
    "flyLeaf",
    "backCover",
    "backEndPaper",
    "backEndSheet"
  ];


  identifierTypes: any[] = [];
  identifierTypeCodes = [ 'barcode', 'issn','isbn', 'isbn', 'ccnb', 'uuid', 'urnnbn', 'oclc', 'sysno', 'permalink', 'sici'];


  @Input() 
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  constructor(private editor: EditorService, private api: ApiService, public translator: Translator) {
    this.translate();
    translator.languageChanged.subscribe(() => this.translate());
  }


  translate() {
    this.translator.waitForTranslation().then(() => {
      this.identifierTypes = [];
      for (const code of this.identifierTypeCodes) {
        this.identifierTypes.push({code: code, name: this.translator.instant('identifier.' + code)});
      }
      this.identifierTypes.sort((a: any, b: any): number => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
  }


  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
   this.api.getPage(pid).subscribe((page: Page) => {
      this.page = page;
      console.log('page', page);
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

  onRevert() {
    this.page.restore();
  }

  onSave() {
    if (!this.page.hasChanged()) {
      return;
    }
    this.page.removeEmptyIdentifiers();
    this.editor.savePage(this.page, (page: Page) => {
      this.page = page;
    });
  }

}
