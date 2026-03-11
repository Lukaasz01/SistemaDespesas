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
      email: this.identifier,
      password: this.password,
    };

    console.log("Enviando para o Java: ", dadosLogin);

    this.http.post('http://localhost:8080/login/entrar', dadosLogin, { responseType: 'text' })
      .subscribe({
        next: (respostaDoJava) => {
          alert('O Back-end respondeu: ' + respostaDoJava);
          this.router.navigate(['/home']);
        },
        error: (erro) => {
          console.error("Erro na comunicação com o Back-end:", erro);
          alert('Falha ao comunicar com o servidor. Olhe o console (F12).');
        }
      });
  }

}