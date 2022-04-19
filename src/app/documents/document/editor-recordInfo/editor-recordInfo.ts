import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import {CodebookService} from '../../../services/codebook.service';

@Component({
  selector: 'app-editor-recordInfo',
  templateUrl: './editor-recordInfo.component.html',
  styleUrls: ['./editor-recordInfo.scss']
})
export class EditorRecordInfoComponent implements OnInit {

  @Input() field: ElementField;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }



}
