import { Component, Input, OnInit } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent implements OnInit {

  @Input() field: ElementField;

  constructor() { }

  ngOnInit() {
  }

}
