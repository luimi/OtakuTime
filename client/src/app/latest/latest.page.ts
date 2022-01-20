import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimeService } from '../api/anime.service';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.page.html',
  styleUrls: ['./latest.page.scss'],
})
export class LatestPage implements OnInit {
  server :string
  latest = [];
  query: string;
  constructor(private aRoute: ActivatedRoute, private anime: AnimeService, private router: Router) { 
    
  }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    if(this.server){
      let response: any = await this.anime.getLatest(this.server);
      if(response && response.success) {
        this.latest = response.data;
      }
    }
  }
  search(){
    if(this.query && this.query.trim().length>0){
      this.router.navigateByUrl(`/search/${this.server}/${this.query}`);
    }
  }
}
