import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../api/rest.service';
import { FavoritesService } from '../utils/favorites.service';
import { SeenService } from '../utils/seen.service';

@Component({
  selector: 'app-episodies',
  templateUrl: './episodies.page.html',
  styleUrls: ['./episodies.page.scss'],
})
export class EpisodiesPage implements OnInit {
  server: string;
  public url: string;
  anime;
  isLoading = false;
  constructor(private aRoute: ActivatedRoute, private rest: RestService, public favorites: FavoritesService, private seen: SeenService) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.url = this.aRoute.snapshot.paramMap.get('url');
    if (this.server && this.url) {
      this.isLoading = true;
      let response: any = await this.rest.getEpisodes(this.server, this.url);
      if (response && response.success) {
        this.anime = response.data;
      }
      this.isLoading = false;
    }
  }
  async ionViewDidEnter() { }
}
