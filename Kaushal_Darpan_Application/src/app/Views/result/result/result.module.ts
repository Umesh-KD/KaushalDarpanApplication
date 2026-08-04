import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './result.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../../material.module';
import { LoaderModule } from '../../Shared/loader/loader.module';
import { OTPModalModule } from '../../otpmodal/otpmodal.module';
import { ResultRoutingModule } from './result-routing.module';

@NgModule({
  declarations: [ResultComponent],
  imports: [
    CommonModule,
    ResultRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    ScrollingModule,
    MaterialModule,
    OTPModalModule,
  ]
})
export class ResultModule { }
