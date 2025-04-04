
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ModsElement } from '../../model/mods/element.model';
import { LayoutService } from '../../services/layout-service';
import { UsageComponent } from '../usage/usage.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule,
    MatIconModule, MatTooltipModule, CdkTextareaAutosize,
    MatFormFieldModule, MatInputModule, UsageComponent],
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
    setTimeout(() => {
      if (this.ta) {
        
      this.observer = new ResizeObserver(() => {
        //this.layout.setMetadataResized();
      }).observe(this.ta.nativeElement)
      }
    }, 10);
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
