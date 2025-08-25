import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DTEPublicInfoRoutingModule } from './dte-public-info-routing.module';
import { DTEPublicInfoComponent } from './dte-public-info.component';
import { EmitraDashboardModule } from '../Emitra/emitra-dashboard/emitra-dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { DTEPublicInfoTabsComponent } from '../dtepublic-info-tabs/dtepublic-info-tabs.component';
import { DTEPublicInfoTabsModule } from '../dtepublic-info-tabs/dtepublic-info-tabs.module';
import { AllotStatusComponent } from '../Emitra/allotment-status/allot-status.component';
import { EditOptionFormComponent } from '../Emitra/edit-option-form/edit-option-form.component';
import { CorrectionMeritComponent} from '../Emitra/merit-correction/merit-correction.component';
import { OTPModalModule } from '../otpmodal/otpmodal.module';


@NgModule({
  declarations: [
    DTEPublicInfoComponent,
    AllotStatusComponent,
    EditOptionFormComponent,
    CorrectionMeritComponent
  ],
  imports: [
    CommonModule,
    DTEPublicInfoRoutingModule,
    /*EmitraDashboardModule,*/
    DTEPublicInfoTabsModule,
    FormsModule, ReactiveFormsModule, LoaderModule, OTPModalModule
  ],
})
export class DTEPublicInfoModule { }
