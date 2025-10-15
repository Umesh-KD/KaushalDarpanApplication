import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITIExaminationPublicInfoTabsRoutingModule } from './iti-Examination-public-info-Tabs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
/*import { AllotmentStatusITIComponent } from '../Emitra/allotment-status-iti/allotment-status-iti.component';*/
/*import { ItiAdmissionComponent } from '../iti-admission/iti-admission.component';*/
//import { KnowMeritITIComponent } from '../Emitra/know-merit-iti/know-merit-iti.component';
//import { UpwardMomentITIComponent } from '../Emitra/upward-moment-iti/upward-moment-iti.component';
import { ITIExaminationPublicInfoTabsComponent } from './iti-Examination-public-info-Tabs.component';
import { ITISearchComponent } from '../iti-search/iti-search.component';
import { TableSearchFilterModule } from '../../Pipes/table-search-filter.module';
import { OTPModalModule } from '../otpmodal/otpmodal.module';

@NgModule({
  declarations: [
    ITIExaminationPublicInfoTabsComponent
  ],
  imports: [
    CommonModule,
    ITIExaminationPublicInfoTabsRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    TableSearchFilterModule, OTPModalModule
  ],
  exports: [ITIExaminationPublicInfoTabsComponent]
})
export class ITIExaminationPublicInfoTabsModule { }
