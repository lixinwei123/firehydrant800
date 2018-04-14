import { Component, ElementRef, ViewChild } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';

declare var google;

@Component({
  templateUrl: 'places-autocomplete.html'
})
export class AutocompletePage {

    placeSearch: any;
    autocomplete: any;

    @ViewChild('searchAddress', {read: ElementRef}) searchAddress: ElementRef;
    constructor (public viewCtrl: ViewController
                 ,public alertCtrl: AlertController) {
    }

    ngAfterViewInit(){
        //set up autocomplete
        var nativeHomeInputBox = this.searchAddress.nativeElement.querySelector('.searchbar-input');
        console.log(nativeHomeInputBox);
        this.autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {types: []});
    }

    //present alert
    presentFlagAlert() {
        let alert = this.alertCtrl.create({
        title: 'Invalid address format...',
        buttons: [
            {
                text: 'Okay!',
            }
        ]
        });
        alert.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    returnNewLocation(){
        try{
            var address = this.autocomplete.getPlace();
            var longLat = address.geometry.location.lng() + ", " + address.geometry.location.lat();

            console.log("location", address);
            console.log("longLat", longLat);

            let obj = {
              address: address.formatted_address,
              lat: address.geometry.location.lat(),
              lng: address.geometry.location.lng()
            }

            this.viewCtrl.dismiss(obj);
        }catch(e){
            this.presentFlagAlert();
            console.error(e);
        }
    }
}
