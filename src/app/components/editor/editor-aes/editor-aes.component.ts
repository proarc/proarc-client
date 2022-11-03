import { CodebookService } from '../../../services/codebook.service';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/services/layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-editor-aes',
  templateUrl: './editor-aes.component.html',
  styleUrls: ['./editor-aes.component.scss']
})
export class EditorAesComponent implements OnInit {

  

  constructor(
    private api: ApiService,
    private ui: UIService,
    private dialog: MatDialog,
    public config: ConfigService,
    public layout: LayoutService,
    public codebook: CodebookService) {
  }

  ngOnInit() {
  }

  onSave() {

  }

  canSave(): boolean {
    return true;
  }

}
