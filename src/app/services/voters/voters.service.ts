import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VotersService {

  constructor(private http: HttpClient) { }

  getVoters() {
    return this.http.get(`https://electionupc.firebaseio.com/voters.json`);
  }

  postPeopleWhoVoted(email, date) {
    const voter = {
      email,
      date
    };
    return this.http.post(`https://electionupc.firebaseio.com/votesDone.json`, voter)
      .subscribe(() => { }, (error) => console.log(error));
  }

  postBallotLeftTime(timeToFinish: number) {
    return this.http.put(`https://electionupc.firebaseio.com/ballotTime/timeEnd.json`, timeToFinish)
      .subscribe(() => { }, (error) => console.error(error));
  }

  getBallotLeftTime() {
    return this.http.get(`https://electionupc.firebaseio.com/ballotTime/timeEnd.json`);
  }

  postSetupStep(steps: number) {
    return this.http.put(`https://electionupc.firebaseio.com/stepConsole/steps.json`, steps)
      .subscribe(() => { }, (error) => console.error(error));
  }

  getSetupStep() {
    return this.http.get(`https://electionupc.firebaseio.com/stepConsole/steps.json`);
  }

  postBallotEndConfirm() {
    return this.http.put(`https://electionupc.firebaseio.com/ballotTime/setBallotConfirm.json`, true)
      .subscribe(() => { }, (error) => console.error(error));
  }

  getBallotEndConfirm() {
    return this.http.get(`https://electionupc.firebaseio.com/ballotTime/setBallotConfirm.json`);
  }

}
