import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xml-view',
  templateUrl: './xml-view.component.html',
  styleUrls: ['./xml-view.component.scss']
})
export class XmlViewComponent implements OnInit {

  @Input() xml: string;

  constructor() { }

  ngOnInit() {
  }

}
