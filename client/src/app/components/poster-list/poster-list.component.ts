import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/utils/analytics.service';
import { ConfigurationService } from 'src/app/utils/configuration.service';

@Component({
  selector: 'app-poster-list',
  templateUrl: './poster-list.component.html',
  styleUrls: ['./poster-list.component.scss'],
})
export class PosterListComponent implements OnInit {
  listType = "list";
  @Input() data;
  @Input() server;
  @Input() path;
  constructor(private config: ConfigurationService, private analytic: AnalyticsService) {
    
    
  }

  ngOnInit() {}
  ngDoCheck(){
    let configuration = this.config.getConfiguration();
    this.listType = configuration.listType;
  }
  toggleListType(){
    this.listType = this.listType==='list'?'grid':'list';
    this.config.setListType(this.listType);
    this.analytic.sendEvent("view",this.listType);
  }
}
