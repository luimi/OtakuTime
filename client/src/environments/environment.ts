// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server: process.env['NG_APP_SERVER'] || "http://localhost:8000",
  firebaseConfig : {
    apiKey: "AIzaSyAWMq1AY51_6bFVDh-XR347KHHGLle8NCQ",
    authDomain: "otakutime-7dd2f.firebaseapp.com",
    projectId: "otakutime-7dd2f",
    storageBucket: "otakutime-7dd2f.appspot.com",
    messagingSenderId: "762998527590",
    appId: "1:762998527590:web:a946d8d7518920f352bfa7",
    measurementId: "G-T9XR5J7NMP"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
