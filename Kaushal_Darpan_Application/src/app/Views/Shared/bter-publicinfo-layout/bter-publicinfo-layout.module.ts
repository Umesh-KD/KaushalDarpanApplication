import { NgModule } from '@angular/core';
import { BterPublicInfoLayoutComponent } from './bter-publicinfo-layout.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    component: BterPublicInfoLayoutComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
})
export class BterPublicInfoLayoutModule { }
