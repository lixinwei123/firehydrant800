import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AutocompletePage } from './places-autocomplete';
import { AngularFireDatabase } from 'angularfire2/database';
<<<<<<< HEAD
import { Observable } from 'rxjs/Observable';
=======
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
>>>>>>> 771f0716530f60fce4c94bc8e0be39afd0393c17

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


//----------------- HOME PAGE CONSTRUCTOR -------------
export class HomePage {
  fires$: any;

  constructor(public navCtrl: NavController
    ,private modalCtrl: ModalController
    ,private afData: AngularFireDatabase
    ,private LaunchNavigator: LaunchNavigator) {

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


  //--------- LAUNCH DIRECTION -----------
  launchDirection(){
    console.log('This function is triggered');
      let options: LaunchNavigatorOptions = {
      start: 'London, ON',
      app: this.LaunchNavigator.APP.UBER
    };

    this.LaunchNavigator.navigate('Toronto, ON', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }
}
