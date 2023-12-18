import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../api/rest.service';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  query: string;
  type: string;
  animes = [];
  result: any[];
  isLoading = false;
  emptyState;
  constructor(private aRoute: ActivatedRoute, private rest: RestService, private utils : UtilsService) { }

  async ngOnInit() {
    this.query = this.aRoute.snapshot.paramMap.get('query');
    this.type = this.aRoute.snapshot.paramMap.get('type');
    if(this.type && this.query){
      this.isLoading = true;
      this.result = await this.rest.getAllSearch(this.type,this.query);
      /*let response:any = await this.rest.getSearch(this.server, this.query);
      if(response && response.success){
        this.animes = response.data;
        if(this.animes.length===0){
          this.emptyState = {
            icon: 'search',
            title: 'Sin resultados',
            message: 'No se encontró resultados para esta búsqueda.'
          }
        }
      } else {
        this.emptyState = {
          icon: 'server',
          title: 'Ocurrio un error',
          message: 'Es posible que algo haya pasado con el servidor de origen'
        }
      }*/
      this.isLoading = false;
    }
  }

}
