import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-subject-geo',
  templateUrl: './editor-subject-geo.component.html',
  styleUrls: ['./editor-subject-geo.component.scss']
})
export class EditorSubjectGeoComponent implements OnInit {
  @Input() field: ElementField;

  private types: string[] = ['geo:origin', 'geo:storage', 'geo:area'];

  constructor() {
  }

  ngOnInit() {
  }


}
