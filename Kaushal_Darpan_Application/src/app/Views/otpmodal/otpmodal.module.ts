import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { OTPModalComponent } from './otpmodal.component';
import { OTPModalRoutingModule } from './otpmodal-routing.module';


@NgModule({
    declarations: [
        OTPModalComponent
    ],
    imports: [
        CommonModule,
        OTPModalRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule
    ],
    exports: [OTPModalComponent]
})
export class OTPModalModule { }
