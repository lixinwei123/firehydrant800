import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AutocompletePage } from './places-autocomplete';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  fires$: any;

  constructor(public navCtrl: NavController
    ,private modalCtrl: ModalController
    ,private afData: AngularFireDatabase

    ) {
      this.loadFires();

  }

  loadFires() {
    this.fires$ = this.afData.list(`fires`).valueChanges()

  }

  openModal(){
    let autocompleteModal = this.modalCtrl.create(AutocompletePage);
    autocompleteModal.present();
    autocompleteModal.onDidDismiss(data=> {
      let addressData = data;
      this.createFire(addressData);

    })
  }

  createFire(addressData) {

    let ref = this.afData.database.ref(`fires`)
    let key = ref.push().key
    let obj = {
      address: addressData.address,
      latlng: addressData.latlng,
      id: key
    }
    ref.child(key).update(obj);
  }

}
