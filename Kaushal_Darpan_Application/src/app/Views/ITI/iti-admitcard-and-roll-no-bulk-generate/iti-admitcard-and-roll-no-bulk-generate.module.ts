import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ITIAdmitcardAndRollNoBulkGenerateRoutingModule } from './iti-admitcard-and-roll-no-bulk-generate-routing.module';
import { ITIAdmitcardAndRollNoBulkGenerateComponent } from './iti-admitcard-and-roll-no-bulk-generate.component';


@NgModule({
  declarations: [
    ITIAdmitcardAndRollNoBulkGenerateComponent
  ],
  imports: [
    CommonModule,
    ITIAdmitcardAndRollNoBulkGenerateRoutingModule
  ]
})
export class ITIAdmitcardAndRollNoBulkGenerateModule { }
