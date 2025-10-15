import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { ITIExaminationPublicInfoComponent } from './iti-Examination-public-info.component';
import { ITIExaminationPublicInfoRoutingModule } from './iti-Examination-public-info-routing.module';
import { ITIPublicInfoTabsModule } from '../itipublic-info-tabs/itipublic-info-tabs.module';
import { ITIExaminationPublicInfoTabsModule } from '../iti-Examination-public-info-Tabs/iti-Examination-public-info-Tabs.module';


@NgModule({
  declarations: [    
    ITIExaminationPublicInfoComponent
  
  ],
  imports: [
    CommonModule,
    ITIExaminationPublicInfoRoutingModule,
    /*EmitraDashboardModule,*/    
    FormsModule, ReactiveFormsModule, LoaderModule, ITIPublicInfoTabsModule,
    ITIExaminationPublicInfoTabsModule
  ],
})
export class ITIExaminationPublicInfoModule { }
