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
        .subscribe((token) => { },
          (err) => { });
    });
  }

  // "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4ODQ4YjVhZmYyZDUyMDEzMzFhNTQ3ZDE5MDZlNWFhZGY2NTEzYzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWxlY3Rpb251cGMiLCJhdWQiOiJlbGVjdGlvbnVwYyIsImF1dGhfdGltZSI6MTU4ODMwMTk1OSwidXNlcl9pZCI6Ilo0UmNQQkMxTTZNR0h0QURjWVJmV2o5OWdEdDEiLCJzdWIiOiJaNFJjUEJDMU02TUdIdEFEY1lSZldqOTlnRHQxIiwiaWF0IjoxNTg4MzAxOTU5LCJleHAiOjE1ODgzMDU1NTksImVtYWlsIjoiaGVjdG9yLWZyYW5jbzJAdXBjLmVkdS5jbyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJoZWN0b3ItZnJhbmNvMkB1cGMuZWR1LmNvIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.hIgBTXTQ1gV_D4e4_bz5QDcMZ8ZReL3VAFAa0cNRpgVr_9SH9VSYBndkyYbmlhoSdg9SM6XlYEbALEGr-Y0KznPAlzs9iv6WHMjR4NCRHmW9K1Pg8-n03RLDgfd1iFnunVieMK0aikUrpv8CyyX1rLTNKwRX0SaPcl6a-bLpM0byKO2tZqJEBnltkjaahwQ3xpv5CC31yAnV2F8D-LJV1iPrqXXgAEj-Vfa87LNI60qdoqLOZG8YdXXQB1OuckfQsIK3wCqJ1cf3W4clL6JeoT7cblq6SBzjCh2BEkwBtvzVGgc0n16PRhR-B6dQZP0hq5K3Unq0R_pnZxLnb4SVJg"
  registerExample() {
    const authData = {
      email: 'hector19971997@hotmail.com',
      password: 'abc123',
      returnSecureToken: true
    };

    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, authData);
  }

  sendEmailVerification(idToken) {
    const verifyObject = {
      requestType: 'VERIFY_EMAIL',
      idToken
    };

    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`, verifyObject);
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
