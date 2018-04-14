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
  maps: google.maps.Map;

  constructor(public navCtrl: NavController, public navParams: NavParams) {


  }


  //------- INIT MAP ------
  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.maps = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }


}
