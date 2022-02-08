import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../api/rest.service';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.page.html',
  styleUrls: ['./latest.page.scss'],
})
export class LatestPage implements OnInit {
  server :string
  latest = [];
  query: string;
  isLoading = false;
  timeOut;
  constructor(private aRoute: ActivatedRoute, private rest: RestService, private router: Router) { 
    
  }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    if(this.server){
      this.isLoading = true;
      let response: any = await this.rest.getLatest(this.server);
      if(response && response.success) {
        this.latest = response.data;
      }
      this.isLoading = false;
    }
  }
  search(evt){
    if(this.timeOut){
      window.clearTimeout(this.timeOut);
      this.timeOut = undefined;
    }
    this.isLoading = true;
    this.timeOut = window.setTimeout(()=> {
      if(this.query && this.query.trim().length>0){
        this.router.navigateByUrl(`/search/${this.server}/${this.query}`);
      }
      this.isLoading = false;
    },3000);
  }
}
