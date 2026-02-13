import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      [ngClass]="[
        'skeleton',
        type ? 'skeleton-' + type : '',
        customClass
      ]"
      [style.width]="width"
      [style.height]="height"
      [attr.aria-label]="ariaLabel || 'Loading placeholder'"
    ></span>
  `,
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  @Input() type: 'avatar' | 'info' | 'text' | 'circle' | 'rect' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '16px';
  @Input() customClass: string = '';
  @Input() ariaLabel?: string;
}
