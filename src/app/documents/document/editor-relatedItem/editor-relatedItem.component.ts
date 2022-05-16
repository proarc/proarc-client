import { Component, OnInit, Input } from '@angular/core';

import { ElementField } from 'src/app/model/mods/elementField.model';
import {CodebookService} from '../../../services/codebook.service';
import {Translator} from 'angular-translator';
import {MatDialog} from '@angular/material';
import {EditorService} from '../../../services/editor.service';

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
