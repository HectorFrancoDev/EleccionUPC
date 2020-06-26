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

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Ingresando',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    this.auth.login(this.admin)
      .subscribe((token: any) => {

        if (token.localId === 'WFNDArULuYRQGDa5Kl36eXusMht1') {
          this.getUserState(token.idToken);
        } else {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'No estás registrado'
          });
        }

      }, (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'No estás registrado'
        });
      });

  }

  getUserState(idToken) {
    this.auth.getUserState(idToken)
      .subscribe((user: any) => {
        const verify: boolean = user.users[0].emailVerified;
        if (verify === true) {
          this.auth.guardarAdminToken(idToken);
          Swal.close();
          if (this.auth.isAdmin() === true) {
            this.router.navigateByUrl('/console');
          }
        } else {

          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'No Verificado',
            text: 'No estás verificado, revisa tu e-mail por favor'
          });

        }
      }, (error) => {
        console.log(error);
      });
  }

}
