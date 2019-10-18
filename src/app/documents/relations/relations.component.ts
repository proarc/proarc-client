import { Component, OnInit, Input } from '@angular/core';

import { Translator } from 'angular-translator';
import { Relation } from 'src/app/model/relation.model';



@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss']
})
export class RelationsComponent implements OnInit {

  @Input() relations: Relation[];

  constructor() {

  }

  ngOnInit() {
  }



}
