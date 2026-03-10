import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);

  executarLogin(email : string, password : string) {
    this.http.post('http://localhost:8080/login', {email : email, senha : password});
  }

}
