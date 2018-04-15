import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the FireDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-fire-detail',
  templateUrl: 'fire-detail.html',
})
export class FireDetailPage {
  fire: any;
   longitude: any;
  latitude: any;
    fires$: any;
    hydData: any;
    bestHyd: {
      id: number,
      dist: number,
    };
     hydArray = [];

  constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, private geolocation: Geolocation, private afData: AngularFireDatabase, private storage: Storage ) {
    this.fire = navParams.get('fire');
    console.log("Fire", this.fire)
    // this.getLocation();
    this.calcBest();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FireDetailPage');
  }


   //--------- CALCULATE THE BEST HYDRANT TO THE FIRE --------
  async calcBest(){
   await this.afData.database.ref('firehydrants').once('value',dataSnap =>{
      this.hydData = dataSnap.val();
    })
      for(var i in this.hydData){
        var curDist = this.calculateDistance(this.fire.lat,this.fire.lng,this.hydData[i].lat,this.hydData[i].lng);
        var obj = {
          dist: curDist.toFixed(2),
          id: parseInt(i),
          lng: this.hydData[i].lng,
          lat: this.hydData[i].lat
        }
        if(this.hydData[i].Critical == false && this.hydData[i].OutOfService == false){
        this.hydArray.push(obj);
        }
      }
        this.hydArray.sort(function(x,y){
          return x.dist - y.dist
        });
      this.hydArray = [this.hydArray[0],this.hydArray[1],this.hydArray[2],this.hydArray[3],this.hydArray[4]];
      console.log("all hyd",this.hydArray);


      //--------- STORE CLOSEST ALL HYDRANTS IN NATIVE STORAGE --------
      this.storage.set('hydArray', this.hydArray);

      //------------------ REVERSE GEOENCODING THE FIRE HYDRANT ITEMS ------------
      for (let i in this.hydArray){
        let hyd = this.hydArray[i]
        let lat = hyd.lat
        let lng = hyd.lng
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAoVoi8F7YFDzp6tp5azw2oJDbSFaZPKn0`
        const res = await this.http.get(url).toPromise();
        let address = res.json().results[0].formatted_address;
        this.hydArray[i].address = address;

        // this.http.get(url).subscribe(res=> {
        //   let address = res.json().results[0].formatted_address
        //   console.log(address)
        //   this.hydArray[i].address = address;
        // })
      }
  }

  //------------------ FUNCTION TO CALCULATE THE DISTANCE BETWEEN TWO POINTS -------------
  calculateDistance(lat1,lon1,lat2,lon2){
      let R = 6371; // Radius of the earth in km
      let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d;
  }
 deg2rad(deg) {
      return deg * (Math.PI/180)
  }

}
