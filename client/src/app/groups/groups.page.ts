import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GroupsService } from '../utils/groups.service';
import { ModalAddComponent } from './modal-add/modal-add.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  constructor(private modalCtrl: ModalController, public groups: GroupsService) { }

  ngOnInit() {

  }
  async newGroup(){
    const modal = await this.modalCtrl.create({
      component: ModalAddComponent
    });
    return await modal.present();
  }
}
