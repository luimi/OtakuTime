import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { AnalyticsService } from './utils/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private analytic: AnalyticsService) {
    analytic.sendEvent("Init","app");
  }
}
