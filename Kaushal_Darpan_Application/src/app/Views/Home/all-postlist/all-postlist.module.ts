import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPostlistRoutingModule } from './all-post-routing.module';
import { AllPostlistComponent } from './all-postlist.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AllPostlistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AllPostlistRoutingModule
  ]
})
export class AllPostlistModule { }
