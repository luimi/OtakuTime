import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';

@Component({
  selector: 'app-season',
  templateUrl: './season.page.html',
  styleUrls: ['./season.page.scss'],
})
export class SeasonPage implements OnInit {
  season;
  isLoading = false
  titles = {
    "TV (New)": "Nuevos",
    "TV (Continuing)": "Continuacion",
    "ONA": "ONA",
    "OVA": "OVA",
    "Movie": "Película",
    "Special": "Especiales",
  }
  obj = Object;
  constructor(private rest: RestService) { }

  async ngOnInit() {
    this.isLoading = true
    this.season = await this.rest.getSeason()
    this.isLoading = false
  }

}
