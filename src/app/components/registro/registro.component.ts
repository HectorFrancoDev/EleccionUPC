import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user: UserModel = new UserModel();

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Registrando',
      text: 'Espere un momento...',
    });
    Swal.showLoading();

    this.auth.registerNewUser(this.user)
      .subscribe((token) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Registro exitoso',
        });

      this.router.navigateByUrl('/ingresar');
      },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error registro',
            text: 'Usuario previamente registrado'
          });
        });
  }

}
