import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  sidebarWidth: number = 280; // Default width
  isResizing: boolean = false;
  showSidebar = signal(true);
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
      this.showSidebar.set(!isHome);
    });
  }

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault(); // Text selection rokne ke liye
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;

    // Sidebar ki nayi width set karein (min 150px aur max 500px ki limit ke saath)
    if (event.clientX >= 250 && event.clientX <= 700) {
      this.sidebarWidth = event.clientX;
    }
  }

  onMouseUp() {
    this.isResizing = false;
  }
}
