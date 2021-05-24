
import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-publisher',
  templateUrl: './editor-publisher.component.html',
  styleUrls: ['./editor-publisher.component.scss']
})
export class EditorPublisherComponent implements OnInit {

  @Input() field: ElementField;

  constructor() {
  }

  ngOnInit() {
  }

}
