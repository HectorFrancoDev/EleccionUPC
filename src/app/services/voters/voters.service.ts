import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VotersService {

  constructor(private http: HttpClient) { }

  getVoters() {
    return this.http.get(`https://electionupc.firebaseio.com/voters.json`);
  }

  postCandidate(name: string) {
    const candidate = {
        name,
        voteCount: 0
    };
    return this.http.post(`https://electionupc.firebaseio.com/candidates.json`, candidate);
  }
}
