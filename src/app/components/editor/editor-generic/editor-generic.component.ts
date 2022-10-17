import { Component, Input, OnInit } from '@angular/core';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { ConfigService } from 'src/app/services/config.service';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-editor-generic',
  templateUrl: './editor-generic.component.html',
  styleUrls: ['./editor-generic.component.scss']
})
export class EditorGenericComponent implements OnInit {

  @Input('editorType') editorType: string;
  @Input('pid') pid: string;
  @Input('data') data: any;
  @Input('item') item: string = 'root';
  @Input('switchable') switchable: boolean;


  constructor(
    public config: ConfigService,
    public editor: EditorService) { }

  ngOnInit(): void {
  }

}
