import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeenService {
  private DBNAME = "OtakuTime";
  private DBSEENTABLE = "seen"
  private DB;
  private seen = [];
  constructor() {
    this.InitDB();
  }
  private InitDB() {
    let request = indexedDB.open(this.DBNAME, 1);
    request.onsuccess = (event) => {
      if (!this.DB) {
        this.DB = request.result;
      }
    }
    request.onupgradeneeded = (event) => {
      let db = request.result;
      switch (event.oldVersion) {
        case 0:
          db.createObjectStore(this.DBSEENTABLE, { keyPath: 'episodeUrl' });
      }
    };
  }
  private getObjectStore(type) {
    return this.DB.transaction(this.DBSEENTABLE, type).objectStore(this.DBSEENTABLE)
  }
  addSeen(episode, episodeList) {
    this.getObjectStore("readwrite")
      .add({ episodeUrl: episode, episodeListUrl: episodeList }).onsuccess = (event) => {
        //event.target.result;
      };
  }
  getSeen(url) {
    return new Promise((res,rej) => {
      this.getObjectStore("readonly")
      .openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
          let value = cursor.value;
          if(value.episodeListUrl === url)
            this.seen.push(cursor.value.episodeUrl)
          cursor.continue();
        } else {
          res("");
        }
      }
    });
  }
  wasSeen(url){
    return this.seen.includes(url);
  }
  removeSeen(url){
    this.getObjectStore("readwrite").delete(url);
    this.seen.splice(this.seen.indexOf(url),1)
  }
}
