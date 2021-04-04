
import { Component, OnInit, Input } from '@angular/core';
import { ElementField } from 'src/app/model/mods/elementField.model';

@Component({
  selector: 'app-editor-publisher',
  templateUrl: './editor-publisher.component.html',
  styleUrls: ['./editor-publisher.component.scss']
})
export class EditorPublisherComponent implements OnInit {

  @Input() field: ElementField;

  eventTypes: string[] = ['production', 'publication', 'distribution', 'manufacture', 'copyright'];

  issuances: string[] = ['monographic', 'single unit', 'multipart monograph',
                                         'continuing', 'serial', 'integrating resource'];

  qualifiers: string[] = ['approximate', 'inferred', 'questionable'];

  constructor() {
  }

  ngOnInit() {
  }

}
