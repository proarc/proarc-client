import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { transformGeometryWithOptions } from 'ol/format/Feature';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  items: any[];

  constructor(
    private translator: TranslateService,
    private dialog: MatDialog,
    private api: ApiService,
    private ui: UIService) { }

  ngOnInit(): void {
    this.getWorkflow();
  }

  getWorkflow() {
    this.api.getWorkflow().subscribe((response: any) => {
      if (response['response'].errors) {
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        return;
      }
      this.items = response.response.data;
    });
  }

}
