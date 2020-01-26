import { EditorService } from 'src/app/services/editor.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LocationDialogComponent } from 'src/app/dialogs/location-dialog/location-dialog.component';

@Component({
  selector: 'app-editor-geo',
  templateUrl: './editor-geo.component.html',
  styleUrls: ['./editor-geo.component.scss']
})
export class EditorGeoComponent implements OnInit {

  state = 'none';

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  constructor(public editor: EditorService) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    this.state = 'loading';
    this.editor.loadMetadata(() => {
      this.state = 'success';
    });
  }

  onSave() {
    this.editor.saveMetadata(() => {
    });
  }

}
