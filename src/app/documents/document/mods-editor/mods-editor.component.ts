import { Component, OnInit, Input } from '@angular/core';
import { DigitalDocument } from 'src/app/model/document.model';

@Component({
  selector: 'app-mods-editor',
  templateUrl: './mods-editor.component.html',
  styleUrls: ['./mods-editor.component.scss']
})
export class ModsEditorComponent implements OnInit {

  @Input() document: DigitalDocument;

  constructor() { }

  ngOnInit() {
  }

}
