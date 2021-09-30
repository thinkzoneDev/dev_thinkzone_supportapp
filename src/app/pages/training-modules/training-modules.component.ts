import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, NavController } from '@ionic/angular';
// import { Training2Page } from '../pages/training2/training2.page';
import { Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-training-modules',
  templateUrl: './training-modules.component.html',
  styleUrls: ['./training-modules.component.scss']
})
export class TrainingModulesComponent implements OnInit {
  list;

  data_list = [
    { bgcolor: 'linear-gradient(to right top, #3872c9, #009eea, #00c2d0, #00dd85, #a8eb12)' },
    { bgcolor: 'linear-gradient(to right top, #bc38c9, #de00a4, #ef007a, #f30050, #eb1225)' },
    { bgcolor: 'linear-gradient(to right top, #f8ed03, #bcff7c, #a0ffc7, #b9fff5, #f1fafb)' },
    { bgcolor: 'linear-gradient(to right top, #ff0324, #dd6800, #b19100, #80ac13, #44be64)' },

    { bgcolor: 'linear-gradient(to right top, #0b0a0a, #3a1825, #602454, #6c3e98, #1768e7)' },
    { bgcolor: 'linear-gradient(to right top, #3872c9, #009eea, #00c2d0, #00dd85, #a8eb12)' },
    { bgcolor: 'linear-gradient(to right top, #f8d803, #ff9244, #ff578b, #ce56c7, #2068d8)' },
    { bgcolor: 'linear-gradient(to right top, #d438f6, #ff0089, #ff6800, #d6bc00, #17ee32)' },

  ]
  constructor(
    public dataServ: DataService,
    public navCtrl: NavController,
    public modalController: ModalController) {
    this.list = dataServ.getData('submodules');
  }

  ngOnInit() {
  }
  async submodule_click(submodule) {
    this.dataServ.setData('submodule', submodule);
    this.navCtrl.navigateForward('training-content');
  }

}
