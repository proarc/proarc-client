import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { CodebookService } from 'src/app/services/codebook.service';

@Component({
  selector: 'app-editor-location',
  templateUrl: './editor-location.component.html',
  styleUrls: ['./editor-location.component.scss']
})
export class EditorLocationComponent implements OnInit {

  @Input() field: ElementField;
  @Input() data: any;

  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }


}
