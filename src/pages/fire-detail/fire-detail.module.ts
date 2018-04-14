import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FireDetailPage } from './fire-detail';

@NgModule({
  declarations: [
    FireDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FireDetailPage),
  ],
})
export class FireDetailPageModule {}
