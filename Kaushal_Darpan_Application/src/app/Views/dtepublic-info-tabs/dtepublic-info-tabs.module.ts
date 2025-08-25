import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DTEPublicInfoTabsRoutingModule } from './dtepublic-info-tabs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from '../Shared/loader/loader.module';
import { DTEPublicInfoTabsComponent } from './dtepublic-info-tabs.component';
import { DTEApplicationComponent } from '../Emitra/dte-application/dte-application.component';
import { DifferenceFormComponent } from '../Emitra/difference-form/difference-form.component';


@NgModule({
  declarations: [
    DTEPublicInfoTabsComponent,   
    DTEApplicationComponent,
    DifferenceFormComponent
  ],
  imports: [
    CommonModule,
    DTEPublicInfoTabsRoutingModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [DTEPublicInfoTabsComponent]
})
export class DTEPublicInfoTabsModule { }
