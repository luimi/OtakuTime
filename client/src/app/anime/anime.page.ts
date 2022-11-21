import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';
import { UtilsService } from '../utils/utils.service';


@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {
  servers = []
  skeleton = []
  constructor(private rest: RestService, private utils: UtilsService) { }

  async ngOnInit() {
    this.skeleton = this.utils.getSkeletonList()
    let response: any = await this.rest.getAnimes();
    if(response && response.success){
      this.servers = response.data;
      this.servers.sort((a,b) =>  a.enabled?-1: 1 );
    }
  }

}
