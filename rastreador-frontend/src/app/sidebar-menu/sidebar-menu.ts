import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { clearAuthSession } from '../core/auth-session';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar-menu.html',
  styleUrl: './sidebar-menu.css',
})
export class SidebarMenu {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  deslogando = false;

  logout(): void {
    if (this.deslogando) {
      return;
    }

    this.deslogando = true;

    this.http.post<void>('http://localhost:9000/login/logout', {}).subscribe({
      next: () => this.finalizarLogout(),
      error: () => this.finalizarLogout(),
    });
  }

  private finalizarLogout(): void {
    clearAuthSession();
    this.deslogando = false;
    void this.router.navigate(['/login']);
  }
}
