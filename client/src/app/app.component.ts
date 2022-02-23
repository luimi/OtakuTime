import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private firebaseConfig = {
    apiKey: "AIzaSyAWMq1AY51_6bFVDh-XR347KHHGLle8NCQ",
    authDomain: "otakutime-7dd2f.firebaseapp.com",
    projectId: "otakutime-7dd2f",
    storageBucket: "otakutime-7dd2f.appspot.com",
    messagingSenderId: "762998527590",
    appId: "1:762998527590:web:a946d8d7518920f352bfa7",
    measurementId: "G-T9XR5J7NMP"
  };
  constructor() {
    const app = initializeApp(this.firebaseConfig);
    const analytics = getAnalytics(app);
    logEvent(analytics, "Init",{});
  }
}
