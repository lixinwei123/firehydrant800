import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {} from '@types/googlemaps';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  @ViewChild('gmap') gmapElement: any;
  fireMap: google.maps.Map;
  marker: google.maps.Marker;
  mylatlang = google.maps.LatLng;
  hydrantsArr: any;
  markerArr: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {

  }


  //---------------- INIT MAP -------------
  ngOnInit() {

    var mapProp = {
         center: new google.maps.LatLng(39.9565273, -75.1907409),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.fireMap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);



  var marker = new google.maps.Marker(
   {
       position: new google.maps.LatLng(39.9565273, -75.1907409),
       map: this.fireMap,
   });
   var marker2 = new google.maps.Marker(
    {
        position: new google.maps.LatLng(39.957889, -75.188931),
        map: this.fireMap,
    });


}


  //------- MARKER FUNCTION ------

}
