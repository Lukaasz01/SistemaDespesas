import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { clearAuthSession } from '../core/auth-session';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  identifier = '';
  password = '';

  private router = inject(Router);
  private http = inject(HttpClient);

  logar() {
    const dadosLogin = {
      email: this.identifier, //
      password: this.password,
    };

    clearAuthSession();

    this.http.post<any>('http://localhost:9000/login/auth', dadosLogin).subscribe({
            next: (resposta) => {
              sessionStorage.setItem('meu_token', resposta.token);
              sessionStorage.setItem('nomeUsuario', resposta.nome);
              sessionStorage.setItem('usuario_id', String(resposta.id));

              this.router.navigate(['/home']);
            },
            error: (erro) => {
              console.error("Erro detalhado: ", erro);
              alert("Falha no login!");
            }
        });
  }

}
