import { Component, OnInit, Input } from '@angular/core';
import { DigitalDocument } from './node_modules/src/app/model/document.model';
import { ApiService } from './node_modules/src/app/services/api.service';

@Component({
  selector: 'app-mods-editor',
  templateUrl: './mods-editor.component.html',
  styleUrls: ['./mods-editor.component.scss']
})
export class ModsEditorComponent implements OnInit {

  @Input() document: DigitalDocument;
  

  constructor(private api: ApiService) { }

  ngOnInit() {
  }


  save() {
    this.api.editMods(this.document).subscribe(result => {
      console.log('mods saved', result);
    }, () => {
    });
  }


}