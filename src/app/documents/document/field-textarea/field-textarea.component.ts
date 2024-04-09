
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModsElement } from 'src/app/model/mods/element.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-field-textarea',
  templateUrl: './field-textarea.component.html',
  styleUrls: ['./field-textarea.component.scss']
})
export class FieldTextareaComponent implements OnInit {

  @Input() item: ModsElement;
  @Input() field: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('ta') ta: ElementRef;
  observer: any;

  constructor(private layout: LayoutService) {
  }

  ngOnInit() {}

  ngAfterViewInit(){
    //setTimeout(() => {
      this.observer = new ResizeObserver(() => {
        this.layout.setMetadataResized();
      }).observe(this.ta.nativeElement)
    //}, 10);
  }

  ngOnDestroy() {
    if(this.ta && this.observer) {
      this.observer.unobserve(this.ta.nativeElement);
    }
    
  }

  // changed(value: any) {
  //   this.valueChange.emit(value);
  // }

}
