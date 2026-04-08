import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
      email: this.identifier, // ou o campo do formulário correspondente
      password: this.password,
    };

    this.http.post('http://localhost:9000/login/auth', dadosLogin, { responseType: 'text' }).subscribe({
        next: (tokenDoJava) => {
          console.log("SUCESSO! O Token é: ", tokenDoJava);

          // salva o token
          sessionStorage.setItem('meu_token', tokenDoJava);
          this.router.navigate(['/home']);
        },
        error: (erro) => {
          console.error("Erro detalhado: ", erro);
          alert("Falha no login!");
        }
    });
  }

}
