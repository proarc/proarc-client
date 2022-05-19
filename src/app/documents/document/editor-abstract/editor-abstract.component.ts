import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import {CodebookService} from '../../../services/codebook.service';

@Component({
  selector: 'app-editor-abstract',
  templateUrl: './editor-abstract.component.html',
  styleUrls: ['./editor-abstract.component.scss']
})
export class EditorAbstractComponent implements OnInit {


  @Input() field: ElementField;
  @Input() title: string;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }



}
