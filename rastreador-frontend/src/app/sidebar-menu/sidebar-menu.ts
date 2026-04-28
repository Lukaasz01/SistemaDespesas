import { Component, inject } from '@angular/core'; // Adicionamos o 'inject' aqui
import { RouterLink, Router } from '@angular/router'; // Adicionamos o 'Router' aqui

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterLink], // Removemos o SidebarMenu daqui
  templateUrl: './sidebar-menu.html',
  styleUrl: './sidebar-menu.css',
})
export class SidebarMenu {

  // Injetando o Router para permitir a navegação
  private router = inject(Router);

  logout() {
      sessionStorage.removeItem('meu_token');
      sessionStorage.removeItem('nomeUsuario');

      this.router.navigate(['/login']); // Agora isso vai funcionar perfeitamente!
  }

}
