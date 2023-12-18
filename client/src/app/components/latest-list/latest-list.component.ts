import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AnalyticsService } from 'src/app/utils/analytics.service';
import { ConfigurationService } from 'src/app/utils/configuration.service';

@Component({
  selector: 'app-latest-list',
  templateUrl: './latest-list.component.html',
  styleUrls: ['./latest-list.component.scss'],
})
export class LatestListComponent implements OnInit {

  listType = "grid";
  @Input() data;
  @Input() path;
  constructor(private config: ConfigurationService, private analytic: AnalyticsService, private actionSheetCtrl: ActionSheetController, private router: Router) {
  }

  ngOnInit() { }
  ngDoCheck() {
    let configuration = this.config.getConfiguration();
    this.listType = configuration.listType;
  }
  toggleListType() {
    this.listType = this.listType === 'list' ? 'grid' : 'list';
    this.config.setListType(this.listType);
    this.analytic.sendEvent("view", this.listType);
  }
  async showOptions(options: any[]) {
    if (options.length === 1) {
      this.open(options[0])
      return
    }
    let buttons = []
    options.forEach((option) => {
      buttons.push({
        text: option.name,
        role: "server",
        data: option,
      })
    })
    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
    })
    let config = {
      header: 'Selecciona un servidor',
      buttons: buttons
    }
    const actionSheet = await this.actionSheetCtrl.create(config);

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss()
    if (result.data) {
      this.open(result.data)
    }
  }
  open(option) {
    this.router.navigate([this.path, option.server, option.contentUrl])
  }
}
