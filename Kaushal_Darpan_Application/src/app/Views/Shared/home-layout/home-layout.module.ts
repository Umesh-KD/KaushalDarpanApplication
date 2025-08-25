import { NgModule } from '@angular/core';
import { HomeLayoutComponent } from './home-layout.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    component: HomeLayoutComponent
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
export class HomeLayoutModule { }
