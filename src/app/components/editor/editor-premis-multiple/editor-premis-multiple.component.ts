import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-editor-premis-multiple',
  templateUrl: './editor-premis-multiple.component.html',
  styleUrls: ['./editor-premis-multiple.component.scss']
})
export class EditorPremisMultipleComponent implements OnInit {
  state = 'none';
  editIndex: any;
  pageIndex: any;

  agentIdentifierType: string;
  agentIdentifierValue: string;
  agentName: string;
  agentType: string;
  agentNote: string;

  constructor(
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
  }

  save() {

  }

  canSave() {
    return true;
  }

}
