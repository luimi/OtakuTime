import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RestService } from '../api/rest.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SeenService } from '../utils/seen.service';
import { AnalyticsService } from '../utils/analytics.service';
import { environment } from 'src/environments/environment';

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
  emptyState;
  getVideoPath = environment.server+"/getVideo?url=";
  constructor(private aRoute: ActivatedRoute, private rest: RestService, private toastCtrl: ToastController, private sanitizer: DomSanitizer, private seen: SeenService, private analytic: AnalyticsService) { }

  async ngOnInit() {
    this.server = this.aRoute.snapshot.paramMap.get('server');
    this.url = this.aRoute.snapshot.paramMap.get('url');
    if(this.server && this.url){
      this.isLoading = true;
      let response:any = await this.rest.getEpisode(this.server,this.url);
      if(response && response.success){
        this.episode = response.data;
        this.seen.addSeen(this.url,this.episode.episodes)
        if(this.episode.pages && this.episode.pages.length>0){
          this.addPages()
        }
        if(!this.episode.title){
          this.emptyState = {icon:"thumbs-down-outline",title:"Capitulo no encontrado",message:"Este capitulo al parecer, no esta disponible"}
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
    this.analytic.sendEvent("episode","clipboard");
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
    this.streamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoPath+url);
    this.analytic.sendEvent("episode","stream");
  }
}
