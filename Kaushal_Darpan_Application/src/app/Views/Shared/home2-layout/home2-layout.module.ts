import { NgModule } from '@angular/core';
import { Home2LayoutComponent } from './home2-layout.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    component: Home2LayoutComponent
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
export class Home2LayoutModule { }
