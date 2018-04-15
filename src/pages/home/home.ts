import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { AutocompletePage } from './places-autocomplete';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';
import { HydrantProvider } from '../../providers/hydrant/hydrant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


//----------------- HOME PAGE CONSTRUCTOR -------------
export class HomePage {

    //----- LIST OF VARIABLES -------
    longitude: any;
    latitude: any;
    fires$: any;
    hydData: any;
    bestHyd: {
      id: number,
      dist: number,
    };
    fireArr: any[];


//-------- CONSTRUCTOR FOR CALCULATING THE HOME.TS PAGE -----------
  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private afData: AngularFireDatabase,
    private geolocation: Geolocation,
    public hydInfo: HydrantProvider,
    private alertCtrl: AlertController,
    private LaunchNavigator: LaunchNavigator) {

    //--------- LOAD ALL THE FIRE HYDRANTS ----------
    this.loadFires(39.9565273, -75.1907409);

    //--------- GET LOCATION --------
    this.getLocation();
    //this.calcBest();
  }


  async calcBest(){


//----------------- LOAD ALL THE FIRE HYDRANTS AND THEN CALCUALTE BETWEEN TWO DISTANCES ------------
   await this.afData.database.ref('firehydrants').once('value',dataSnap =>{
      this.hydData = dataSnap.val();
    })

        console.log(this.latitude);
        console.log(this.longitude);

        if (!this.latitude) this.latitude = 39.9644620;
        if (!this.longitude) this.longitude = -75.207807;



        //--------------- LOOP THROUGH THE FIRE HYDRANT DATA AND THEN CALCUALTE THE DIFFERENCES --------
        for(var i in this.hydData){
            var curDist = this.calculateDistance(this.latitude,this.longitude,this.hydData[i].lat,this.hydData[i].lng);
            if (!this.bestHyd){
              this.bestHyd = {
                dist: curDist,
                id: parseInt(i)
              }
            }
            else {
              if(curDist < this.bestHyd.dist){
                this.bestHyd['dist'] = curDist
                this.bestHyd['id'] = parseInt(i);
              }
            }
      }
      console.log("best one is here", this.bestHyd);
  }

  //------------ OPEN MODAL FOR THE PAGES --------
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


  //------------- CREATE FIRE -------------
  createFire(addressData) {
    let ref = this.afData.database.ref(`fires`)
    let key = ref.push().key
    let obj = {
      address: addressData.address,
      lat: addressData.lat,
      lng: addressData.lng,
      id: key
    }
    ref.child(key).update(obj);
  }


  //----------------- GEO LOCATION -----------
   getLocation(){
     this.geolocation.getCurrentPosition().then((resp) => {

      console.log("THIS FUNCTION IS CALLED");

     this.longitude = resp.coords.longitude;
     this.latitude = resp.coords.latitude;
     console.log("Finished getting geolocation");
     this.loadFires(this.latitude, this.longitude)


     this.calcBest();
     console.log("HO",this.longitude,this.latitude);
     // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  //-----------Calculate how far away the fire is
  loadFires(lat, lng) {
      this.fires$ = this.afData.list("fires").valueChanges();
      this.fires$.subscribe(fireArr=> {
        this.fireArr = fireArr;
        this.fireArr.forEach(fire=>{
          let fireLat = fire.lat
          let fireLng = fire.lng
          fire.count = 0;

          if (fire.hydrants){
              let count = Object.keys(fire.hydrants).length;
               fire.count = count;
          }
          fire.distance = this.calculateDistance(lat, lng, fireLat, fireLng).toFixed(2);
          console.log(fire.distance);
        })

        this.fireArr.sort(function(x,y){
          return x.distance - y.distance;
        })
      })


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

      let R = 6371; // Radius of the earth in km
      let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      //console.log(d);
      return d;
  }


  //----------- DEGREE CONVERSION ---------
  deg2rad(deg) {
      return deg * (Math.PI/180)
  }

  //------------Open fire detail page
  openFireDetail(fire){
    this.navCtrl.push('FireDetailPage', {fire: fire})
  }


  async removeFire(fire){
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
            this.afData.database.ref(`fires/${fire.id}/hydrants`).once("value", snap=> {
              let data = snap.val()
              if (data){
                let hydrantIDs = Object.keys(data)
              hydrantIDs.forEach(id=> {
                //Remove these hydrants from in use
                console.log("id of hydrants", id)
                this.afData.database.ref(`inuse/${id}`).remove();
              })
              }

            })
            this.afData.database.ref(`fires/${fire.id}`).remove();


          }
        }
      ]
    })
    alert.present();
  }
}
