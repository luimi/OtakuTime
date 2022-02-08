import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  
  constructor(private http: HttpClient) { }

  async getAnimes(){
    try{
      return await this.http.get(`${environment.server}/anime`).toPromise();
    }catch(e){

    }
  }
  async getMangas(){
    try{
      return await this.http.get(`${environment.server}/manga`).toPromise();
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
      return await this.http.post(`${environment.server}/`,params).toPromise();
    }catch(e){}
  }
}
