import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
})
export class MangaPage implements OnInit {
  episodes: any[];
  query;
  isLoading = false;
  constructor(private rest: RestService, private utils: UtilsService) { }

  async ngOnInit() {
    this.episodes = await this.rest.getAllLatest("manga")
  }
  search(){
    this.utils.search(this.query, 'manga',(loading) => this.isLoading = loading)
  }
}
