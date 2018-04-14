import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FireDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fire-detail',
  templateUrl: 'fire-detail.html',
})
export class FireDetailPage {
  fire: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fire = navParams.get('fire');
    console.log("Fire", this.fire)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FireDetailPage');
  }

}
