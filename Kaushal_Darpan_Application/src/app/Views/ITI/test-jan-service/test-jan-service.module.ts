import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestJanServiceRoutingModule } from './test-jan-service-routing.module';
import { TestJanServiceComponent } from './test-jan-service.component';
import { JanAadharDetailModule } from '../../new-jan-aadhar/new-jan-aadhar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TestJanServiceComponent
  ],
  imports: [
    CommonModule,
    TestJanServiceRoutingModule,
    JanAadharDetailModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TestJanServiceModule { }
