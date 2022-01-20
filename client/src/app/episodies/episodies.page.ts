import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../api/anime.service';
import { FavoritesService } from '../utils/favorites.service';

@Component({
  selector: 'app-episodies',
  templateUrl: './episodies.page.html',
  styleUrls: ['./episodies.page.scss'],
})
export class EpisodiesPage implements OnInit {
  server :string;
  url: string;
  anime;
  constructor(private aRoute: ActivatedRoute, private _anime: AnimeService, private favorites: FavoritesService) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.url = this.aRoute.snapshot.paramMap.get('url');
    if(this.server && this.url){
      let response:any = await this._anime.getEpisodes(this.server, this.url);
      if(response && response.success){
        this.anime = response.data;
      }
    }
  }
  
}
