import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../api/rest.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  server :string;
  query: string;
  animes = [];
  isLoading = false;
  constructor(private aRoute: ActivatedRoute, private rest: RestService) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.query = this.aRoute.snapshot.paramMap.get('query');
    if(this.server && this.query){
      this.isLoading = true;
      let response:any = await this.rest.getSearch(this.server, this.query);
      if(response && response.success){
        this.animes = response.data;
      }
      this.isLoading = false;
    }
  }

}
