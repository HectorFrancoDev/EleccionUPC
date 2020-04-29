import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  admin: UserModel = new UserModel();

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Ingresando',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    this.auth.login(this.admin)
      .subscribe((token: Token) => {

        if (token.localId === 'OVzPk4yy5XV8dPjJwU9W6vC634X2') {
          Swal.close();
          this.router.navigateByUrl('console');
        } else {
          Swal.close();

          Swal.fire({
            icon: 'error',
            title: 'Error de autentificación',
            text: 'Usuario no encontrado'
          });
          return;
        }
      },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error de autentificación',
            text: 'Usuario no encontrado'
          });
        });
  }

}

interface Token {
  localId: string;
}
