import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  getRandomNum(min,max){
    return Math.floor(Math.random() * (max - min)) + min
  }
  getSkeletonList(){
    let skeleton = [];
    for(let i = 0 ; i < 20 ; i++){
      skeleton.push(this.getRandomNum(40,80)+"%")
    }
    return skeleton
  }
}
