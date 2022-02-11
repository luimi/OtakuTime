import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RestService } from '../api/rest.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.page.html',
  styleUrls: ['./episode.page.scss'],
})
export class EpisodePage implements OnInit {
  server;
  url;
  episode;
  isLoading = false;
  pages = []
  lastPageAdded;
  streamUrl;
  constructor(private aRoute: ActivatedRoute, private rest: RestService, private toastCtrl: ToastController, private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.url = this.aRoute.snapshot.paramMap.get('url');
    if(this.server && this.url){
      this.isLoading = true;
      let response:any = await this.rest.getEpisode(this.server,this.url);
      if(response && response.success){
        this.episode = response.data;
        if(this.episode.pages){
          this.addPages()
        }
      }
      this.isLoading = false;
    }
  }
  ionViewWillLeave(){
    this.streamUrl = undefined;
  }
  getDomain(url){
    let domain = (new URL(url));
    return domain.hostname.replace("www","");
  }
  copyToClipboard(text: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.presentToast();
  }
  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Link copiado al clipboard',
      duration: 2000
    });
    toast.present();
  }
  addPages(event?){
    let timeBetweenpages = 3000;
    let pagesToAdd = 3;
    if(event){
      event.target.complete();
    }
    if(this.lastPageAdded && performance.now()-this.lastPageAdded<timeBetweenpages){
      return
    }
    let current = this.pages.length
    for(let i = current; i < current+pagesToAdd && i < this.episode.pages.length ; i++){
      this.pages.push(this.episode.pages[i])
    }
    if(this.pages.length === this.episode.pages.length && event){
      event.target.disabled = true;
    }
    this.lastPageAdded = performance.now();
  }
  playStream(url){
    this.streamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
