import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
// import { filter } from 'rxjs/operators';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe((event: NavigationEnd) => {
    //   const isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
    // });
  }
}
