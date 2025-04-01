import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resizeColumn]'
})
export class ResizecolDirective {

  @Input("resizeColumn") resizable!:boolean;
  @Output('columnResized') columnResized: EventEmitter<number> = new EventEmitter();
  private startX!:number;
  private startWidth!:number;
  private column!: HTMLElement;

  private table!: HTMLElement;

  private pressed!: boolean;
  mouseDownFunc = () => {};
  mouseMoveFunc = () => {};
  mouseUpFunc = () => {};

  constructor(private renderer: Renderer2, private el: ElementRef) { 
    this.column = this.el.nativeElement;
  }

  ngOnDestroy() {
    this.mouseDownFunc();
    this.mouseMoveFunc();
    this.mouseUpFunc();
  }

  ngOnInit(){
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);
      const resizer = this.renderer.createElement("span");
      this.renderer.addClass(resizer, "app-resize-holder");
      //console.log(this.column.style.width)
      if (!this.column.style.width) {
        this.renderer.setStyle(this.column, "width", `${this.column.offsetWidth}px`);
      }
      
      this.renderer.appendChild(this.column, resizer);
      this.mouseDownFunc = this.renderer.listen(resizer, "mousedown", this.onMouseDown);
      //this.renderer.listen(this.table, "mousemove", this.onMouseMove);
      this.mouseMoveFunc = this.renderer.listen("document", "mousemove", this.onMouseMove);
      this.mouseUpFunc = this.renderer.listen("document", "mouseup", this.onMouseUp);
    }
  }
  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 0;
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, "app-resizing");
      let width =this.startWidth + (event.pageX - this.startX - offset);
      this.renderer.setStyle(this.column, "width", `${width}px`);
      if (!this.column.nextSibling || this.column.nextSibling.nodeType === Node.COMMENT_NODE ) {
        this.table.parentElement.parentElement.scrollLeft = this.table.scrollWidth;
      }
      // this.columnResized.emit(width);
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, "resizing");
      this.columnResized.emit(this.column.offsetWidth);
      event.stopImmediatePropagation();
    }
  };
}
