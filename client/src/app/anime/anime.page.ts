import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';
import { UtilsService } from '../utils/utils.service';


@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {
  episodes: any[];
  query;
  isLoading = false;
  constructor(private rest: RestService, private utils: UtilsService) { }

  async ngOnInit() {
    this.episodes = undefined;
    this.episodes = await this.rest.getAllLatest("anime")
  }
  search(){
    this.utils.search(this.query, 'anime',(loading) => this.isLoading = loading)
  }
}
