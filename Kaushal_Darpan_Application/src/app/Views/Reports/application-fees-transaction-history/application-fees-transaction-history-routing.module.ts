import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationFeesTransactionHistoryComponent } from './application-fees-transaction-history.component';

const routes: Routes = [{ path: '', component: ApplicationFeesTransactionHistoryComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApplicationFeesTransactionHistoryRoutingModule { }
