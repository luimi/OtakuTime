import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
})
export class MangaPage implements OnInit {
  servers = []
  constructor(private rest: RestService) { }

  async ngOnInit() {
    let response: any = await this.rest.getMangas();
    if(response && response.success){
      this.servers = response.data;
    }
  }
}
