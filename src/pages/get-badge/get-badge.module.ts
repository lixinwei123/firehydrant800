import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetBadgePage } from './get-badge';

@NgModule({
  declarations: [
    GetBadgePage,
  ],
  imports: [
    IonicPageModule.forChild(GetBadgePage),
  ],
})
export class GetBadgePageModule {}
