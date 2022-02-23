import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private CONFIGURATION_KEY = "configuration"
  private configuration
  constructor() {
    if(localStorage.getItem(this.CONFIGURATION_KEY)) {
      this.configuration =  JSON.parse(localStorage.getItem(this.CONFIGURATION_KEY));
    } else {
      this.configuration = {listType:"list"}
    }
      
  }
  getConfiguration(){
    return this.configuration;
  }
  setListType(type){
    this.configuration.listType = type;
    this.save();
  }
  save(){
    localStorage.setItem(this.CONFIGURATION_KEY,JSON.stringify(this.configuration));
  }
}
