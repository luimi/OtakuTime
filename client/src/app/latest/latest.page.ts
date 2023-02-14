import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../api/rest.service';
import { AnalyticsService } from '../utils/analytics.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.page.html',
  styleUrls: ['./latest.page.scss'],
})
export class LatestPage implements OnInit {
  server :string
  serverName: string
  latest = [];
  query: string;
  isLoading = false;
  timeOut;
  skeleton = [];
  emptyState;
  constructor(private aRoute: ActivatedRoute, private rest: RestService, private router: Router, private utils: UtilsService, private analytic: AnalyticsService) { 
    
  }

  async ngOnInit() {
    this.skeleton = this.utils.getSkeletonList()
    this.server = this.aRoute.snapshot.paramMap.get('server');
    if(this.server){
      this.analytic.sendEvent("server",this.server);
      this.isLoading = true;
      let response: any = await this.rest.getLatest(this.server);
      if(response && response.success) {
        this.latest = response.data;
        this.serverName = response.server.name;
      } else if(response && !response.success){
        this.emptyState = {
          icon: 'server',
          title: 'Ocurrio un error',
          message: 'Es posible que algo haya pasado con el servidor de origen'
        }
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
