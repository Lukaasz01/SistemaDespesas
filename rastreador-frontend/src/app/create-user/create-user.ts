import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  private router = inject(Router);
  private http = inject(HttpClient);

  nome = ''; 
  email = '';
  password = '';

  cadastrar() {
    const novoUsuario = {
      user: this.nome,
      email: this.email,
      password: this.password,
    };

    console.log("Enviando cadastro para o Java: ", novoUsuario);

    this.http.post('http://localhost:8080/login', novoUsuario).subscribe({
        next: (resposta) => {
          // Se der certo, comemora e manda o usuário para a tela de login!
          alert('Usuário cadastrado com sucesso! ');
          this.router.navigate(['/login']);
        },
        error: (erro) => {
          console.error("Erro no cadastro:", erro);
          alert('Erro ao cadastrar. Verifique o console.');
        }
      });
  }
}