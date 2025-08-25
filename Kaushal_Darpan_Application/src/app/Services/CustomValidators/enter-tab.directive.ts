import {
  Directive,
  Renderer2,
  ElementRef,
  ContentChild,
} from '@angular/core';
@Directive({
  selector: '[enter-tab]',
})
export class EnterTabDirective {
  @ContentChild('nextTab') controls;//: QueryList<any>;
  nextTab;
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngAfterViewInit(): void {
    this.controls.changes.subscribe((controls) => {
      this.createKeydownEnter(controls);
    });
    if (this.controls.length) {
      this.createKeydownEnter(this.controls);
    }
  }
  private createKeydownEnter(querycontrols) {
    querycontrols.forEach((c) => {
      this.renderer.listen(c.nativeElement, 'keydown.enter', (event) => {
        if (this.controls.last != c) {
          let controls = querycontrols.toArray();
          let index = controls.findIndex((d) => d == c);
          if (index >= 0) {
            let nextControl = controls.find(
              (n, i) => n && !n.nativeElement.attributes.disabled && i > index
            );
            if (nextControl) {
              nextControl.nativeElement.focus();
              event.preventDefault();
            }
          }
        }
      });
    });
  }
}
