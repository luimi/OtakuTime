import { Component, OnInit } from '@angular/core';
import { ServersService } from '../api/servers.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  anime = [];
  manga = [];
  constructor(private serverCtrl: ServersService) {

  }

  async ngOnInit() {
    this.anime = await this.serverCtrl.getServers("anime");
    this.manga = await this.serverCtrl.getServers("manga");
  }
  reorder(type, evt) {
    this[type] = this.serverCtrl.reorder(type, evt.detail.from, evt.detail.to);
    evt.detail.complete();
  }
  check(type, index, evt) {
    this[type][index].enabled = evt.target.checked;
    this.serverCtrl.saveServer(type, this[type]);
  }
  async update(type) {
    this[type] = await this.serverCtrl.updateServers(type)
  }
}
