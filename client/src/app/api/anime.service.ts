import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(private http: HttpClient) { }

  async getAnimes(){
    try{
      return await this.http.get(`${environment.server}/anime`).toPromise();
    }catch(e){

    }
  }
  async getLatest(server: string){
    return await this.postRequest({action:'main',server});
  }
  async getEpisode(server: string, url: string){
    return await this.postRequest({action:'episode',server, url});
  }
  async getSearch(server: string, query: string) {
    return await this.postRequest({action:'search',server, query});
  }
  async getEpisodes(server: string, url: string) {
    return await this.postRequest({action:'episodes',server, url});
  }
  async postRequest(params: any){
    try{
      return await this.http.post(`${environment.server}/anime`,params).toPromise();
    }catch(e){}
  }
}
