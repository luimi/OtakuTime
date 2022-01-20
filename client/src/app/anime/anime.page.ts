import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../api/anime.service';


@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {
  servers = []
  constructor(private anime: AnimeService) { }

  async ngOnInit() {
    let response: any = await this.anime.getAnimes();
    if(response && response.success){
      this.servers = response.data;
    }
  }

}
