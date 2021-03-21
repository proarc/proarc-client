import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';
import { CodebookService } from 'src/app/services/codebook.service';

@Component({
  selector: 'app-editor-subject',
  templateUrl: './editor-subject.component.html',
  styleUrls: ['./editor-subject.component.scss']
})
export class EditorSubjectComponent implements OnInit {

  authorities = [ 'czenas', 'eczenas', 'mednas', 'czmesh', 'msvkth', 'agrovoc', 'Konspekt'];

  @Input() field: ElementField;


  constructor(public codebook: CodebookService) {
  }

  ngOnInit() {
  }


}
