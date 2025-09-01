import { NgModule } from '@angular/core';
import { ITIHomeLayoutComponent } from './itihome-layout.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    component: ITIHomeLayoutComponent
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
export class ITIHomeLayoutModule { }
