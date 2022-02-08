import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../api/rest.service';
import { GroupsService } from '../utils/groups.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  group;
  isLoading;
  episodes = {};
  constructor(private aRoute: ActivatedRoute, private _group: GroupsService, private rest: RestService) { 
    let index = this.aRoute.snapshot.paramMap.get('index')
    this.group = this._group.getGroup(index)
  }

  ngOnInit() {
    this.getEpisodes()
  }
  async getEpisodes(){
    this.isLoading = true;
    for (let i = 0 ; i < this.group.selected.length ; i++){
      let anime = this.group.selected[i];
      let response: any = await this.rest.getEpisodes(anime.server,anime.url)
      if(response.success){
        this.episodes[anime.server] = response.data
      }
    }
    this.isLoading = false;
  }
}
