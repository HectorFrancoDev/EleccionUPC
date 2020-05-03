import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


import Swal from 'sweetalert2';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements OnInit {

  user: UserModel = new UserModel();

  constructor(private auth: AuthService,
              private router: Router) {
  }

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

    this.auth.login(this.user)
      .subscribe((token: any) => {
        this.getUserState(token.idToken);

      }, (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'No estás registrado'
        });
      });

  }

  private getUserState(idToken) {
    this.auth.getUserState(idToken)
      .subscribe((user: any) => {
        const verify: boolean = user.users[0].emailVerified;
        if (verify === true) {
          this.auth.guardarToken(idToken);
          Swal.close();
          if (this.auth.isLogin() === true) {
            this.router.navigateByUrl('/candidatos');
          }
        } else {

          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'No Verificado',
            text: 'No estás verificado, revisa tu e-mail por favor'
          })

        }
      }, (error) => {
        console.log(error);
      });
  }
}
