import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  async getAnimes() {
    try {
      return await this.http.get(`${environment.server}/anime`).toPromise();
    } catch (e) {

    }
  }
  async getMangas() {
    try {
      return await this.http.get(`${environment.server}/manga`).toPromise();
    } catch (e) {

    }
  }
  async getLatest(server: string) {
    return await this.postRequest({ action: 'main', server });
  }
  async getEpisode(server: string, url: string) {
    return await this.postRequest({ action: 'episode', server, url });
  }
  async getSearch(server: string, query: string) {
    return await this.postRequest({ action: 'search', server, query });
  }
  async getEpisodes(server: string, url: string) {
    return await this.postRequest({ action: 'episodes', server, url });
  }
  async getAllLatest(type) {
    let latests = await this.getQueryFromServers(type, "latest")
    let result = this.joinRepeated(latests)
    return result
  }
  async getAllSearch(type, query) {
    let search = await this.getQueryFromServers(type, "search", query)
    let result = this.joinRepeated(search)
    return result

  }
  async getQueryFromServers(type, query, search?) {
    let servers: any = await this.http.get(`${environment.server}/${type}`).toPromise();
    let result = [];
    for (let i = 0; i < servers.data.length; i++) {
      //TODO agregar validacion de la configuracion
      if (servers.data[i].enabled) {
        let response: any = query === "latest" ? await this.getLatest(servers.data[i].server) :
          await this.getSearch(servers.data[i].server, search);
        if (response && response.success) result.push(response)
      }
    }
    return result;
  }
  async joinRepeated(items) {
    let result = []
    items.forEach((latest) => {
      latest.data.forEach((item) => {
        //TODO validar casos de mayusculas o simbolos
        let index = result.map((obj) => `${obj.title}${obj.chapter ? obj.chapter : ""}`).indexOf(`${item.title}${item.chapter ? item.chapter : ""}`)
        if (index >= 0) {
          result[index].options.push({ ...latest.server, contentUrl: item.url })
          result[index].posters.push(item.poster)
        } else result.push({ title: item.title, chapter: item.chapter, posters: [item.poster], options: [{ ...latest.server, contentUrl: item.url }] })
      })
    })
    return result;
  }
  async getSeason() {
    return await this.http.get(`${environment.server}/season`).toPromise();
  }
  async postRequest(params: any) {
    try {
      return await this.http.post(`${environment.server}/`, params).toPromise();
    } catch (e) { }
  }
}
