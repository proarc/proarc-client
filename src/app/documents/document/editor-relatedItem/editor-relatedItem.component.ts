import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import {CodebookService} from '../../../services/codebook.service';

@Component({
  selector: 'app-editor-relatedItem',
  templateUrl: './editor-relatedItem.component.html',
  styleUrls: ['./editor-relatedItem.component.scss']
})
export class EditorRelatedItemComponent implements OnInit {

  @Input() field: ElementField;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }
}
