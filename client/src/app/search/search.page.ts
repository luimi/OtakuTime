import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../api/anime.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  server :string;
  query: string;
  animes = [];
  constructor(private aRoute: ActivatedRoute, private anime: AnimeService) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.query = this.aRoute.snapshot.paramMap.get('query');
    if(this.server && this.query){
      let response:any = await this.anime.getSearch(this.server, this.query);
      if(response && response.success){
        this.animes = response.data;
      }
    }
  }

}
