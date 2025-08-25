import { Routes, RouterModule } from '@angular/router'; 
import { SSOLoginComponent } from './ssologin.component';  
import { NgModule } from '@angular/core';
import { LoaderModule } from '../Shared/loader/loader.module';
const routes: Routes = [
  {
    path: '',
    component: SSOLoginComponent  
  }
];

@NgModule({
  declarations: [SSOLoginComponent],
  imports: [RouterModule.forChild(routes), LoaderModule],
  exports: [RouterModule],
})
export class SSOLoginModule { }
 
