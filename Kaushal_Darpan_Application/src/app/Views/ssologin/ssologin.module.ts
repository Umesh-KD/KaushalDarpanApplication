import { Routes, RouterModule } from '@angular/router'; 
import { SSOLoginComponent } from './ssologin.component';  
import { NgModule } from '@angular/core';
import { LoaderModule } from '../Shared/loader/loader.module';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    component: SSOLoginComponent  
  }
];

@NgModule({
  declarations: [SSOLoginComponent],
  imports: [RouterModule.forChild(routes), LoaderModule, CommonModule],
  exports: [RouterModule],
})
export class SSOLoginModule { }
 
