import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';


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
    inuseInfo: any;
    bestHyd: {
      id: number,
      dist: number,
    };
     hydArray = [];

  constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, private geolocation: Geolocation, private afData: AngularFireDatabase, public LaunchNavigator: LaunchNavigator) {
    this.fire = navParams.get('fire');
    console.log("Fire", this.fire)
    // this.getLocation();
    this.getInuse()
    this.calcBest();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FireDetailPage');
  }


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

      for (let i in this.hydArray){
        // this.hydArray[i].address = this.reverseGeocode(this.hydArray[i].lat, this.hydArray[i].lng)
        // console.log(this.hydArray[i].address);
        let hyd = this.hydArray[i]

        let lat = hyd.lat
        let lng = hyd.lng
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAoVoi8F7YFDzp6tp5azw2oJDbSFaZPKn0`
        const res = await this.http.get(url).toPromise();
        let address = res.json().results[0].formatted_address;
        this.hydArray[i].address = address;

      }
  }



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
 deg2rad(deg) {
      return deg * (Math.PI/180)
  }
launchDirection(hyd){
    console.log('This function is triggered');
      let options: LaunchNavigatorOptions = {
      start:  [39.9565453, -75.1907484],
      // app: this.LaunchNavigator.APP
    };

    this.LaunchNavigator.navigate([hyd.lat, hyd.lng], options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
     var obj = {

      }
      obj[hyd.id] = true;
      this.afData.database.ref("inuse").update(obj);
      this.afData.database.ref("fires").child(this.fire.id).child("hydrants").update(obj);
  }

 getInuse(){
   this.afData.database.ref('inuse').on("value",success =>{
       this.inuseInfo = success.val()
   })
 }

}
