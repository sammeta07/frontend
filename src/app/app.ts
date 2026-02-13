import { Component, signal, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  sidebarWidth: number = 280; // Default width
  isResizing: boolean = false;
  showSidebar = signal(true);
  private router = inject(Router);


  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      const isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
      this.showSidebar.set(!isHome);
    });
  }

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault(); // Prevent text selection
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    // Set sidebar's new width (with min 150px and max 500px limit)
    if (event.clientX >= 250 && event.clientX <= 700) {
      this.sidebarWidth = event.clientX;
    }
  }

  onMouseUp() {
    this.isResizing = false;
  }
}
