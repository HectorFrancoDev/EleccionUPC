import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { BallotService } from '../../services/ballot/ballot.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  account: string;

  constructor(private auth: AuthService,
              private router: Router,
              private ballot: BallotService) {

  }

  ngOnInit() {
  }

  isLogin(): boolean {
    return this.auth.isLogin();
  }

  isAdminLogin() {
    return this.auth.isAdmin();
  }

  getAccount() {
    this.ballot.getAccount().then((account) => this.account = account);
    return this.account;
  }

  async getAccountShow() {
    await this.getAccount();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/home');
  }

}
