import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements OnInit {

  user: UserModel = new UserModel();

  constructor(private auth: AuthService, private router: Router) {
  }

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

    this.auth.login(this.user)
      .subscribe((token: any) => {
        this.validEmail(token);
      },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error de autentificación',
            text: 'Usuario no encontrado'
          });
        });
  }


  private validEmail(token: any) {
    this.auth.getUserState(token.idToken)
    .subscribe((user: any) => {
      if (user.users[0].emailVerified) {
        Swal.close();
        this.router.navigateByUrl('/candidatos');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Usuario no verificado',
          text: 'Por favor revisa tu e-mail y verifica tu cuenta'
        });
      }
    }, (error) => console.log(error));
  }

}
