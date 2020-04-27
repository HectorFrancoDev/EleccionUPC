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

    this.auth.login(this.user)
      .subscribe((token) => {
        Swal.close();
        this.router.navigateByUrl('/candidatos');
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
