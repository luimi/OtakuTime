import { Component, OnInit } from '@angular/core';
import { RestService } from '../api/rest.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
})
export class MangaPage implements OnInit {
  servers = []
  skeleton = []
  constructor(private rest: RestService, private utils: UtilsService) { }

  async ngOnInit() {
    this.skeleton = this.utils.getSkeletonList()
    let response: any = await this.rest.getMangas();
    if(response && response.success){
      this.servers = response.data;
    }
  }
}
