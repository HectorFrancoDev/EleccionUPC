import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import getAccount from '../../../getContract/getAccount';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { BallotService } from '../../services/ballot/ballot.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {

  emailVoter: string;
  account: string;
  voted = false;
  date;

  constructor(private auth: AuthService,
    private ballot: BallotService,
    public datepipe: DatePipe,
    private router: Router) {

    const token = localStorage.getItem('voted');
    if (token === 'true') {
      this.voted = true;
      this.checkEmailVoter();
      this.account = this.ballot.account;

      getAccount().then((account) => {
        this.account = account;
      }).catch((err) => {
        console.log(err);
      });

      this.date = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

      Swal.fire({
        icon: 'success',
        title: 'Obten tu certificado',
        text: 'Descarga tu certificado electoral para más beneficios en la universidad'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No ha votado',
        text: 'Usted no participó en la votación'
      });
    }
  }

  checkEmailVoter() {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      this.auth.getUserState(userToken)
        .subscribe((user: any) => {
          this.emailVoter = user.users[0].email;
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Usuario no encontrado',
        text: 'No se encontró el usuario'
      });
    }
  }

  generateCertificate() {

    const element = document.getElementById('pdfCertificate');
    // {scrollY: -window.scrollY}
    html2canvas(element)
      .then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        window.open(imageData);

        const imgHeight = canvas.height * 200 / canvas.width;

        const jspdf = new jsPDF('landscape');

        const imgProps = jspdf.getImageProperties(imageData);
        const pdfWidth = jspdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        jspdf.addImage(imageData, 'PNG', 2, 5, pdfWidth - 10, pdfHeight);

        jspdf.save('certificate_' + this.account + '.pdf');
        this.router.navigateByUrl('/resultados');

      }).catch((error) => console.log(error));
  }

}
