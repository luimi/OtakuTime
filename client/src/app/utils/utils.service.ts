import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  getRandomNum(min,max){
    return Math.floor(Math.random() * (max - min)) + min
  }
  getSkeletonList(qty?){
    let skeleton = [];
    for(let i = 0 ; i < (qty?qty:6) ; i++){
      skeleton.push(this.getRandomNum(40,80)+"%")
    }
    return skeleton
  }
}
