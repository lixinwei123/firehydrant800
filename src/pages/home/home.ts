import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController,
            private LaunchNavigator: LaunchNavigator, private geolocation: Geolocation) {
                console.log(LaunchNavigator);


  }

getLocation(){
  this.geolocation.getCurrentPosition().then((resp) => {
 this.longitude = resp.coords.latitude;
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
