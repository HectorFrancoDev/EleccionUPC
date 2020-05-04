import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  web3: any;
  ballotContract: any;
  ballotFunction: any;
  candidates: any[];

  constructor() {

  }

  ngOnInit() {

  }

}
