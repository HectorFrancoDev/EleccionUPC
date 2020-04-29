import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  voters = [
    {
      email: 'hector-franco@upc.edu.co',
      password: 'abc123',
      returnSecureToken: true
    },
    {
      email: 'camilo-rodriguez3@upc.edu.co',
      password: 'abc123',
      returnSecureToken: true
    },
    {
      email: 'maria-tellez@upc.edu.co',
      password: 'abc123',
      returnSecureToken: true
    },
    {
      email: 'luisa-gonzalez@upc.edu.co',
      password: 'abc123',
      returnSecureToken: true
    },
    {
      email: 'pedro-gomez@upc.edu.co',
      password: 'abc123',
      returnSecureToken: true
    },
    {
      email: 'carlos-cifuentes@upc.edu.co',
      password: 'abc123',
      returnSecureToken: true
    },
  ];

  private apiKey = 'AIzaSyBoLdMxJ4a4GvgzJUpt0CmNqNRLB6o907w';

  userToken: string;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.userToken = undefined;
  }

  login(user: UserModel) {

    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    };

    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(
        (token) => {
          this.guardarToken(token['idToken']);
          return token;
        }
      )
    );

  }

  register() {
    this.voters.forEach(voter => {
      this.reg(voter)
        .subscribe((token) => {  },
         (err) =>  { });
    });
  }

  private reg(voter: any) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, voter);
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }


  isLogin(): boolean {
    if (this.userToken !== undefined && this.userToken.length > 2) {
      return true;
    }
    return false;
  }


}
