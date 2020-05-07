import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { map } from 'rxjs/operators';
import { VotersService } from '../voters/voters.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiKey = 'AIzaSyBoLdMxJ4a4GvgzJUpt0CmNqNRLB6o907w';
  userToken: string;
  adminToken: string;
  logged: boolean;
  loggedAdmin: boolean;

  voters = [] = [];
  votersPrueba = [
    {
      displayName: 'password: <<xBf9825mS>>',
      email: 'hector19971997@gmail.com',
      password: 'xBf9825mS',
      returnSecureToken: true
    },
    {
      displayName: 'password: <<gf8620PM>>',
      email: 'hector19971997@hotmail.com',
      password: 'gf8620PM',
      returnSecureToken: true
    },
  ];

  constructor(private http: HttpClient, private voterService: VotersService) {
    this.leerToken();
    this.getVoters();
  }

  getVoters() {
    this.voterService.getVoters()
      .subscribe(
        (voters: any[]) => this.voters = voters,
        (error) => console.log(error)
      );
  }

  login(user: UserModel) {

    const authData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true
    };

    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, authData);
  }

  register() {
    this.voters.forEach((voter) => {
      this.reg(voter)
        .subscribe((token: any) => {
          this.sendEmailVerification(token.idToken)
            .subscribe(() => { }, (error) => console.log(error));

        }, (error) => console.log(error));

    });
  }

  getUserState(idToken: string) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`, { idToken });
  }


  sendEmailVerification(idToken) {
    const verifyObject = {
      requestType: 'VERIFY_EMAIL',
      idToken
    };
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`, verifyObject);
  }

  logout() {
    localStorage.removeItem('token');
    this.userToken = undefined;
  }

  isAdmin(): boolean {
    if (this.adminToken !== undefined && this.adminToken.length > 2) {
      this.loggedAdmin = true;
      return this.loggedAdmin;
    }
    return false;
  }

  isLogin(): boolean {
    if (this.userToken !== undefined && this.userToken.length > 2) {
      this.logged = true;
      return this.logged;
    }
    return false;
  }

  guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    this.logged = true;
  }

  guardarAdminToken(idToken: string) {
    this.adminToken = idToken;
    localStorage.setItem('token', idToken);
    this.loggedAdmin = true;
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  private reg(voter: any) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, voter);
  }
}
