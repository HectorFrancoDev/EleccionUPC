import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  isLogin(): boolean {
    return this.auth.isLogin();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/home');
  }

}
