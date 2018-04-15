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

    this.markerArr = [];

    this.storage.get('hydArray').then((val) => {
        this.hydrantsArr = val;
        for (let i = 0; i < this.hydrantsArr.length; i++){
            let lng = this.hydrantsArr[i].lng;
            let lat = this.hydrantsArr[i].lat;
            console.log(lat, lng);


            this.markerArr.push(
                new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: this.fireMap,
                    title: 'Hydrant'
                })
            );
        }

        var mapProp = {
          center: new google.maps.LatLng(39.9565273, -75.1907409),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.fireMap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


        console.log(this.markerArr);

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(39.9, -75.19),
            map: this.fireMap,
            title: 'Hydrant'
        })




    });




    //-------- MARKER FOR THE MAPS ------------


    // this.marker = new google.maps.Marker({
    //      position: new google.maps.LatLng(39.9565273, -75.1907409),
    //      map: this.fireMap,
    //      title: 'Hydrant'
    //  });

  }



  //------- MARKER FUNCTION ------

}
