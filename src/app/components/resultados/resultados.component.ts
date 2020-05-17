import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballot/ballot.service';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { VotersService } from '../../services/voters/voters.service';


@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {

  time;
  dateEnd;
  showResults = false;
  resultados = [];

  constructor(private ballot: BallotService,
    private auth: AuthService,
    private voterService: VotersService) {

    this.voterService.getBallotLeftTime()
      .subscribe((resp: any) => {
        this.time = resp;
        this.dateEnd = new Date();
        this.dateEnd.setTime(this.time);
        this.verifyEndTime(this.time);
      }, (error) => {
        Swal.fire({
          icon: 'warning',
          title: 'Espera',
          text: 'Espera hasta que la votación inicie'
        });
      });

  }

  ngOnInit() {
  }

  verifyEndTime(time: number) {

    const currentDate = new Date();
    const currentDateMilliseconds = currentDate.getTime();
    const difference = time - currentDateMilliseconds;

    if (difference > 0) {

      const timeMessage = 'Quedan ' + Math.ceil(difference / 60000) + ' minutos de votación aún';
      Swal.fire({
        icon: 'info',
        title: 'Espera que termine la votación',
        text: timeMessage + ''
      });

    } else {

      this.voterService.getBallotEndConfirm()
        .subscribe((confirmation: boolean) => {
          if (confirmation) {
            this.showResults = true;
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Espera la confirmación del administrador',
              text: 'Espera que el administrador de la votación haga público los resultados de la votación'
            });
          }
        }, (error) => console.log(error));

    }
  }


  async onShowBallotResults() {
    Swal.fire({
      title: 'Haciendo conteo',
      text: 'Obteniendo reultado de la votación...',
    });
    Swal.showLoading();

    await this.ballot.getCandidates()
      .then((result: any[]) => {
        this.resultados = result;
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Resultados obtendios',
          text: 'Puede ver los resultados de la votación ahora mismo'
        });
        this.showResults = true;

      })
      .catch((error) => {
        console.log(error);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los resultados...'
        });
        console.log(error);
      });

  }


}
