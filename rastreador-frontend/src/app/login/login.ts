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
    // Mandando JSON
    const dadosLogin = {
      email: this.identifier,
      password: this.password,
    };

    console.log("Enviando para o Java: ", dadosLogin);

    this.http.get('http://localhost:8080/login', {params: dadosLogin}).subscribe({
        next: (respostaDoJava) => {
          console.log(respostaDoJava);
          this.router.navigate(['/home']);
        },
        error: (erro) => {
          console.log(erro);
          alert(erro.error.erro);
        }
      });
  }

}