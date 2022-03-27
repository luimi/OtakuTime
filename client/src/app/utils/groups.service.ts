import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  public groups = [];
  GROUPS_KEY = "groups"
  constructor(private analytic: AnalyticsService) { 
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
    this.analytic.sendEvent("group","add");
  }
  removeGroup(index){
    this.groups.splice(index,1)
    this.save()
    this.analytic.sendEvent("group","remove");
  }
  save(){
    localStorage.setItem(this.GROUPS_KEY, JSON.stringify(this.groups))
  }

}
