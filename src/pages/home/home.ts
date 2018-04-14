import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { AutocompletePage } from './places-autocomplete';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


//----------------- HOME PAGE CONSTRUCTOR -------------
export class HomePage {

  longitude: any;
  latitude: any;
    fires$: any;


  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private afData: AngularFireDatabase,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,
    private LaunchNavigator: LaunchNavigator) {

    this.getLocation();

    this.loadFires();

  }

  loadFires() {
    this.fires$ = this.afData.list(`fires`).valueChanges()

  }

  openModal(){
    let autocompleteModal = this.modalCtrl.create(AutocompletePage);
    autocompleteModal.present();
    autocompleteModal.onDidDismiss(data=> {
      if (data){
        let addressData = data;
        this.createFire(addressData);
      }


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

  getLocation(){
     this.geolocation.getCurrentPosition().then((resp) => {
     this.longitude = resp.coords.longitude;
     this.latitude = resp.coords.latitude;
     console.log(this.longitude,this.latitude);
     // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  //--------- LAUNCH DIRECTION -----------
  launchDirection(){
    console.log('This function is triggered');
      let options: LaunchNavigatorOptions = {
      start: 'Philadelphia, PA',
      // app: this.LaunchNavigator.APP
    };

    this.LaunchNavigator.navigate('Toronto, ON', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }


  //----------- CALCULATE DISTANCE ----------
  calculateDistance(lat1,lon1,lat2,lon2){
      lat1 = 39.9644620;
      lon1 = -75.2078070;
      lat2 = 39.866441;
      lon2 = -75.077773;


      let R = 6371; // Radius of the earth in km
      let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      console.log(d);
      return d;
  }


  //----------- DEGREE CONVERSION ---------
  deg2rad(deg) {
      return deg * (Math.PI/180)
  }

  removeFire(fire){
    let alert = this.alertCtrl.create({
      title: "Is the fire put out?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },

        {
          text: 'OK',
          handler: ()=> {
            this.afData.database.ref(`fires/${fire.id}`).remove();

          }
        }
      ]
    })


    alert.present();

  }


}
