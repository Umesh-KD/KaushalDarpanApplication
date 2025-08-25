import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appImageError]',
    standalone: false
})
export class ImageErrorDirective
{
  
  @Input() appImageError!: string; // Path to the placeholder image
  @HostBinding('src') @Input() src!: string;

  @HostListener('error')
  onError() {
    
    this.src = this.appImageError || 'assets/images/dummyImg.jpg';
  }
}
