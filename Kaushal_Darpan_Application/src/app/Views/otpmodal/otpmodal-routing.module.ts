import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OTPModalComponent } from './otpmodal.component';

const routes: Routes = [{ path: '', component: OTPModalComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OTPModalRoutingModule { }
