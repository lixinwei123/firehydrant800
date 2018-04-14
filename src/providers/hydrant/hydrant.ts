import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
/*
  Generated class for the HydrantProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HydrantProvider {
hydrants: any
  constructor(public http: HttpClient, public afData: AngularFireDatabase) {
    console.log('Hello HydrantProvider Provider');
    this.setHyd();
  }


  setHyd(){
  	this.afData.database.ref('firehydrants').once('value',dataSnap =>{
  		return dataSnap.val();
  	})
  }


}
