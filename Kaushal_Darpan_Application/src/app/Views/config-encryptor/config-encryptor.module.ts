import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigEncryptorRoutingModule } from './config-encryptor-routing.module';
import { ConfigEncryptorComponent } from './config-encryptor.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConfigEncryptorComponent
  ],
  imports: [
    CommonModule,
    ConfigEncryptorRoutingModule,
    FormsModule
  ]
})
export class ConfigEncryptorModule { }
