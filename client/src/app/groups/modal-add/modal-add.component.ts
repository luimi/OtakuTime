import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RestService } from 'src/app/api/rest.service';
import { GroupsService } from 'src/app/utils/groups.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss'],
})
export class ModalAddComponent implements OnInit {
  query;
  isLoading = false;
  timeOut;
  results : any = {};
  servers;
  skeleton = []
  constructor(private modalCtrl: ModalController, private rest: RestService, private groups: GroupsService, private utils:UtilsService) { }

  ngOnInit() {
    this.skeleton = this.utils.getSkeletonList(3);
  }
  close(){
    this.modalCtrl.dismiss();
  }
  search(evt){
    if(this.timeOut){
      window.clearTimeout(this.timeOut);
      this.timeOut = undefined;
    }
    this.isLoading = true;
    this.timeOut = window.setTimeout(()=> {
      if(this.query && this.query.trim().length>0){
        this.searchInServers()
      } else {
        this.isLoading = false;
      }
    },3000);
  }
  private async searchInServers(){
    let response :any = await this.rest.getAnimes()
    if(!response.success){
      return
    }
    this.servers = response.data;
    for (let i = 0 ; i < this.servers.length ; i++){
      let server = this.servers[i].server
      let result: any = await this.rest.getSearch(server,this.query)
      if(result.success){
        this.results[server] = result.data
      }
    }
    this.isLoading = false;
  }
  save(){
    let selected = []
    let poster
    let title
    if(this.results && Object.keys(this.results).length>0){
      this.servers.forEach(server => {
        if(this.results[server.server])
        this.results[server.server].forEach(anime => {
          if(anime.selected){
            anime.server = server.server;
            anime.name = server.name;
            if(selected.length === 0 || !poster || title){
              title = anime.title
              poster = anime.poster
            }
            selected.push(anime)
          }
        });
      });
      if(title && poster && selected.length>0){
        let group = {title, poster, selected}
        this.groups.addGroup(group)
        this.close()
      }
    }
  }
}
