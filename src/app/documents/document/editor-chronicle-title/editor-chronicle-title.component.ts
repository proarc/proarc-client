import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-chronicle-title',
  templateUrl: './editor-chronicle-title.component.html',
  styleUrls: ['./editor-chronicle-title.component.scss']
})
export class EditorChronicleTitleComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }


}
