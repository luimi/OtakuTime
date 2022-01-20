import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../api/anime.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.page.html',
  styleUrls: ['./episode.page.scss'],
})
export class EpisodePage implements OnInit {
  server;
  url;
  episode;
  constructor(private aRoute: ActivatedRoute, private anime: AnimeService) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.url = this.aRoute.snapshot.paramMap.get('url');
    if(this.server && this.url){
      let response:any = await this.anime.getEpisode(this.server,this.url);
      if(response && response.success){
        this.episode = response.data;
      }
    }
  }
  getDomain(url){
    let domain = (new URL(url));
    return domain.hostname.replace("www","");
  }
  copyToClipboard(text: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
