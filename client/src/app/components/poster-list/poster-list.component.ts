import { Component, Input, OnInit } from '@angular/core';
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
  constructor(private config: ConfigurationService) {
    
    
  }

  ngOnInit() {}
  ngDoCheck(){
    let configuration = this.config.getConfiguration();
    this.listType = configuration.listType;
  }
  toggleListType(){
    this.listType = this.listType==='list'?'grid':'list';
    this.config.setListType(this.listType);
  }
}
