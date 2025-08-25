import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { ITIPublicInfoComponent } from './iti-public-info.component';
import { ITIPublicInfoRoutingModule } from './iti-public-info-routing.module';
import { ITIPublicInfoTabsModule } from '../itipublic-info-tabs/itipublic-info-tabs.module';


@NgModule({
  declarations: [    
    ITIPublicInfoComponent
  
  ],
  imports: [
    CommonModule,
    ITIPublicInfoRoutingModule,
    /*EmitraDashboardModule,*/    
    FormsModule, ReactiveFormsModule, LoaderModule, ITIPublicInfoTabsModule
  ],
})
export class ITIPublicInfoModule { }
