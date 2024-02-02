import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {

  @Input() material: any;

  constructor() { }

  ngOnInit(): void {
  }

  save() {
    
  }

}
