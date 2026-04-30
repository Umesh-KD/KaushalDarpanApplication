import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigEncryptorComponent } from './config-encryptor.component';

const routes: Routes = [{ path: '', component: ConfigEncryptorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigEncryptorRoutingModule { }
