import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../utils/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites = []
  constructor(private _favorites: FavoritesService) { }

  ngOnInit() {
    this.favorites = this._favorites.getFavorites();
  }
  remove(server: string, url: string){
    this._favorites.addRemove(server,url);
    this.favorites = this._favorites.getFavorites();
  }
}
