import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';


@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {
  servers = []
  constructor(private rest: RestService) { }

  async ngOnInit() {
    let response: any = await this.rest.getAnimes();
    if(response && response.success){
      this.servers = response.data;
    }
  }

}
