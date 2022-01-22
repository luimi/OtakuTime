import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  public groups = [];
  GROUPS_KEY = "groups"
  constructor() { 
    if(localStorage.getItem(this.GROUPS_KEY)){
      this.groups = JSON.parse(localStorage.getItem(this.GROUPS_KEY))
    }
  }

  getGroup(index){
    return this.groups[index];
  }
  addGroup(group){
    this.groups.push(group)
    this.save()
  }
  removeGroup(index){
    this.groups.splice(index,1)
    this.save()
  }
  save(){
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(this.groups))
  }

}
