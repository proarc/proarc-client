import { Component, OnInit, Input } from '@angular/core';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-mods-editor',
  templateUrl: './mods-editor.component.html',
  styleUrls: ['./mods-editor.component.scss']
})
export class ModsEditorComponent implements OnInit {

  @Input() document: Metadata;
  

  constructor(private api: ApiService) { }

  ngOnInit() {
  }


  save() {
    this.api.editMetadata(this.document).subscribe(result => {
      console.log('mods saved', result);
    }, () => {
    });
  }


}
