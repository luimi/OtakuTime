import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServersService {
  SERVERS_KEY = "servers";
  public servers = {
    anime: [],
    manga: []
  }

  constructor(private http: HttpClient) {
    if (localStorage.getItem(this.SERVERS_KEY)) {
      this.servers = JSON.parse(localStorage.getItem(this.SERVERS_KEY));
    }
  }

  public async getServers(type) {
    if (this.servers[type].length === 0) {
      const result: any = await this.http.get(`${environment.server}/${type}`).toPromise();
      this.servers[type] = result.data;
      this.save()
    }
    return this.servers[type];
  }
  public async updateServers(type) {
    const result: any = await this.http.get(`${environment.server}/${type}`).toPromise();
    result.data.forEach(server => {
      let found = false;
      this.servers[type].forEach(_server => {
        if (server.server === _server.server) found = true;
      });
      if (!found) this.servers[type].push(server)
    });
    this.save();
    return this.servers[type]
  }

  public saveServer(type, list) {
    this.servers[type] = list;
    this.save()
  }

  public reorder(type, old_index, new_index) {
    if (new_index >= this.servers[type].length) {
      var k = new_index - this.servers[type].length + 1;
      while (k--) {
        this.servers[type].push(undefined);
      }
    }
    this.servers[type].splice(new_index, 0, this.servers[type].splice(old_index, 1)[0]);
    this.save()
    return this.servers[type]
  }

  private save() {
    localStorage.setItem(this.SERVERS_KEY, JSON.stringify(this.servers))
  }
}
