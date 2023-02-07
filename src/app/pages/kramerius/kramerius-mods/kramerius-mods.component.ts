import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Mods } from 'src/app/model/mods.model';

@Component({
  selector: 'app-kramerius-mods',
  templateUrl: './kramerius-mods.component.html',
  styleUrls: ['./kramerius-mods.component.scss']
})
export class KrameriusModsComponent implements OnInit {

  @Input() mods: Mods;


  @ViewChild('editingPre') editingPre: ElementRef;
  @ViewChild('originalPre') originalPre: ElementRef;
  realtime = false;
  state = 'none';
  editting = false;
  anyChange: boolean;
  lastPid: string;

  originalText = '';

  constructor() { }

  ngOnInit(): void {
  }

  

  public setRealtime(enable: boolean) {
    if (enable) {
      this.onClear();
    } else {
      // this.loadPremis();
    }
    this.realtime = enable;
  }

  onEdit() {
    if (this.realtime) {
      return;
    }
    this.originalText = this.originalPre.nativeElement.innerText;
    this.editting = true;
  }

  onClear() {
    if (this.realtime) {
      return;
    }
    this.editting = false;
    this.anyChange = false;
    this.mods.restore();
  }

  onRefresh() {
    if (this.editting || this.realtime) {
      return;
    }
    // this.loadPremis();
  }

  checkChanged() {
    this.anyChange = this.editingPre.nativeElement.innerText !== this.originalText;
  }

  onSave() {

  }

}
