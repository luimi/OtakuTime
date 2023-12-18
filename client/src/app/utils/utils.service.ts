import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private timeOut;
  constructor(private router: Router) { }
  getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }
  getSkeletonList(qty?) {
    let skeleton = [];
    for (let i = 0; i < (qty ? qty : 6); i++) {
      skeleton.push(this.getRandomNum(40, 80) + "%")
    }
    return skeleton
  }
  search(query, type,loading) {
    if (this.timeOut) {
      window.clearTimeout(this.timeOut);
      this.timeOut = undefined;
    }
    loading(true)
    this.timeOut = window.setTimeout(() => {
      if (query && query.trim().length > 0) {
        this.router.navigateByUrl(`/search/${type}/${query}`);
      }
      loading(false)
    }, 3000);
  }
}
