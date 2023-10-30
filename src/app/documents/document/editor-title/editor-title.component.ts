import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import {CodebookService} from '../../../services/codebook.service';
import { ModsTitle } from 'src/app/model/mods/title.model';

@Component({
  selector: 'app-editor-title',
  templateUrl: './editor-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-title.component.scss']
})
export class EditorTitleComponent implements OnInit {

  @Input() field: ElementField;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }

  checkNonSort(item: ModsTitle) {
    item.isNonSortToggleDisabled = item.nonSortToggleDisabled();
  }

}
