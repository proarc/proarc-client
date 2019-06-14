import { Component, OnInit, Input } from '@angular/core';
import { DigitalDocument } from 'src/app/model/document.model';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  @Input() document: DigitalDocument;
  @Input() content: String;
  @Input() subcontent: String;

  constructor() { }

  ngOnInit() {
  }

}
