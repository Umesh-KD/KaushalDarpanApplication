import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIPublicInfoTabsRoutingModule } from './itipublic-info-tabs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
/*import { AllotmentStatusITIComponent } from '../Emitra/allotment-status-iti/allotment-status-iti.component';*/
/*import { ItiAdmissionComponent } from '../iti-admission/iti-admission.component';*/
//import { KnowMeritITIComponent } from '../Emitra/know-merit-iti/know-merit-iti.component';
//import { UpwardMomentITIComponent } from '../Emitra/upward-moment-iti/upward-moment-iti.component';
import { ITIPublicInfoTabsComponent } from './itipublic-info-tabs.component';
import { AllotmentStatusITIComponent } from './allotment-status-iti/allotment-status-iti.component';
import { ItiAdmissionComponent } from './iti-admission/iti-admission.component';
import { KnowMeritITIComponent } from './know-merit-iti/know-merit-iti.component';
import { UpwardMomentITIComponent } from './upward-moment-iti/upward-moment-iti.component';
import { ItiGeneralInstructionsComponent } from './iti-general-Instructions/iti-general-Instructions.component';
import { ITISearchComponent } from '../iti-search/iti-search.component';
import { ItiCollegeSearchComponent } from './iti-college-search/iti-college-search.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';
//import { AllotmentStatusITIComponent } from '../Emitra/allotment-status-iti/allotment-status-iti.component';
//import { KnowMeritITIComponent } from '../Emitra/know-merit-iti/know-merit-iti.component';
//import { UpwardMomentITIComponent } from '../Emitra/upward-moment-iti/upward-moment-iti.component';

//import { ItiAdmissionComponent } from '../Emitra/iti-application/iti-application.component';


@NgModule({
  declarations: [
    ITIPublicInfoTabsComponent,
    AllotmentStatusITIComponent,
    ItiAdmissionComponent,
    UpwardMomentITIComponent,
    KnowMeritITIComponent,
    ItiGeneralInstructionsComponent,
    ItiCollegeSearchComponent
  ],
  imports: [
    CommonModule,
    ITIPublicInfoTabsRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule
  ],
  exports: [ITIPublicInfoTabsComponent]
})
export class ITIPublicInfoTabsModule { }
