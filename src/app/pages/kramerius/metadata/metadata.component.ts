import { Component, Input, OnInit } from '@angular/core';
import { Metadata } from 'src/app/model/metadata.model';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit {

  @Input() metadata: Metadata;
  state = 'none';
  
  constructor() { }

  ngOnInit(): void {
  }

  available(element: string): boolean {
    return this.metadata.template[element];
  }

  onSave() {

  }

}
