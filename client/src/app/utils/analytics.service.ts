import { Injectable } from '@angular/core';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  app;
  analytics
  constructor() { 
    if(getApps().length == 0) {
      this.app = initializeApp(environment.firebaseConfig);
    } else {
      this.app = getApp()
    }
    this.analytics = getAnalytics(this.app);
  }
  sendEvent(tag,name){
    logEvent(this.analytics, tag,{name});
  }
}
