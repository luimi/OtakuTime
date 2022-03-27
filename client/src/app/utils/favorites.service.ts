import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites = [];
  private LOCALSTORAGE_KEY = "favorites";
  constructor(private analytic: AnalyticsService) {
    if (localStorage.getItem(this.LOCALSTORAGE_KEY)) {
      this.favorites = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_KEY))
    }
  }
  public isAdded(server, url) {
    let index = this.getIndex(server,url);
    return index >= 0
  }

  public addRemove(server: string,url: string,anime?: any){
    if(this.isAdded(server, url)){
      let index = this.getIndex(server,url);
      this.favorites.splice(index,1);
      this.analytic.sendEvent("favorite","remove");
    } else {
      this.favorites.push({server,url,title: anime.title,poster: anime.poster});
      this.analytic.sendEvent("favorite","add");
    }
    localStorage.setItem(this.LOCALSTORAGE_KEY,JSON.stringify(this.favorites));
  }
  public getFavorites(){
    return this.favorites;
  }
  public getIndex(server,url){
    return this.favorites.map(o => { return o.server + o.url }).indexOf(server + url)
  }
}
