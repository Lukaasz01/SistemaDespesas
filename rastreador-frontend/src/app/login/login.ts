import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  logar(){
    
    nome = ;
    
    if((this.identifier.toUpperCase() == nome || this.identifier.toUpperCase() == email) && this.password.toUpperCase().trim() == password ) {
      alert('Login successful');
      this.router.navigate(['/home']);
    } else {
      alert('Senha e/ou Usuário incorretos!');
    }
  }
  

}
