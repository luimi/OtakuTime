import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeenService {
  private seen = {};
  private SEEN_KEY = "seen";

  constructor() {
    this.init()
  }
  private init() {
    this.seen = JSON.parse(localStorage.getItem(this.SEEN_KEY) || "{}")
  }
  private save() {
    localStorage.setItem(this.SEEN_KEY, JSON.stringify(this.seen))
  }
  public add(name, chapter) {
    if (this.seen[name] && this.seen[name].includes(chapter)) return
    else if (this.seen[name]) this.seen[name].push(chapter)
    else this.seen[name] = [chapter]
    this.save()
  }
  public remove(name, chapter) {
    let index = this.seen[name].indexOf(chapter)
    this.seen[name].splice(index, 1)
    this.save()
  }
  public isSeen(name, chapter) {
    return this.seen[name] && this.seen[name].includes(chapter)
  }
  public toggle(name, chapter) {
    if (this.seen[name] && this.seen[name].includes(chapter)) this.remove(name, chapter)
    else this.add(name, chapter)
  }

}
