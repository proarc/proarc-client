import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ConfigService } from 'src/app/services/config.service';
import { EditorService } from 'src/app/services/editor.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-generic',
  templateUrl: './editor-generic.component.html',
  styleUrls: ['./editor-generic.component.scss']
})
export class EditorGenericComponent implements OnInit {

  @Input('editorType') editorType: string;

  switchableTypes = ['mods', 'metadata', 'atm', 'ocr']
  switchable: boolean;


  constructor(
    public config: ConfigService,
    public layout: LayoutService) { }

  ngOnInit(): void {

  }

  ngOnChanges(c: SimpleChange) {
    this.switchable = this.switchableTypes.includes(this.editorType);
  }

}
