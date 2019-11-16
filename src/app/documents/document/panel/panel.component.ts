import { Component, OnInit, Input } from '@angular/core';
import { Metadata } from 'src/app/model/metadata.model';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  @Input() document: Metadata;
  @Input() content: String;
  @Input() subcontent: String;

  constructor() { }

  ngOnInit() {
  }

}
