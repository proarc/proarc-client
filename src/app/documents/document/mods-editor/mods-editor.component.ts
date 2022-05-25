import { Component, OnInit, Input } from '@angular/core';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-mods-editor',
  templateUrl: './mods-editor.component.html',
  styleUrls: ['./mods-editor.component.scss']
})
export class ModsEditorComponent implements OnInit {

  @Input() document: Metadata;


  constructor(private api: ApiService, private ui: UIService) { }

  ngOnInit() {
  }


  save() {
    this.api.editMetadata(this.document, false).subscribe((response: any) => {
      if (response.errors) {
        this.ui.showErrorSnackBarFromObject(response.errors);
        return;
      }
    });
  }


}
