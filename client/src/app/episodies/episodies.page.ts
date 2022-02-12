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
        this.updateSeen()
      }
      this.isLoading = false;
    }
  }
  async ionViewDidEnter() {
    if(this.anime && this.anime.episodes){
      this.updateSeen();
    }
    
  }
  async updateSeen(){
    await this.seen.getSeen(this.url)
    this.anime.episodes.forEach(episode => {
      episode.seen = this.seen.wasSeen(episode.url);
    });
  }
  toggleSeen(episode) {
    if (episode.seen) {
      this.seen.removeSeen(episode.url)
    } else {
      this.seen.addSeen(episode.url, this.url)
    }
    episode.seen = !episode.seen;
  }
}
