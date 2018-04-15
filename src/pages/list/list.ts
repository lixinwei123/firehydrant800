import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {} from '@types/googlemaps';

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
  fireHydrantsArr: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {


  }


  //---------------- INIT MAP -------------
  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(39.9565273, -75.1907409),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.fireMap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


    //-------- MARKER FOR THE MAPS ------------


    this.marker = new google.maps.Marker({
         position: new google.maps.LatLng(39.9565273, -75.1907409),
         map: this.fireMap,
         title: 'Hydrant'
     });


  }



  //------- MARKER FUNCTION ------

}
