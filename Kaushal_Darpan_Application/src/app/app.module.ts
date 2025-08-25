import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MasterLayoutComponent } from './Views/Shared/master-layout/master-layout.component';
import { ToastrModule } from 'ngx-toastr';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIdleModule } from '@ng-idle/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeLayoutComponent } from './Views/Shared/home-layout/home-layout.component';
import { AppsettingService } from './Common/appsetting.service';
import { Observable } from 'rxjs';
import { MaterialModule } from './material.module';
import { LoaderInterceptor } from './Services/Loader/loader.interceptor';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthLayoutComponent } from './Views/Shared/auth-layout/auth-layout.component';
import { LoaderModule } from './Views/Shared/loader/loader.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SSOLoginService } from './Services/SSOLogin/ssologin.service';
import { AuthGuard } from './Common/auth.guard.ts';
import { MainLayoutComponent } from './Views/Shared/main-layout/main-layout.component';
import { DTEApplicationLayoutComponent } from './Views/Shared/dte-application-layout/dte-application-layout.component';
import { Home2LayoutComponent } from './Views/Shared/home2-layout/home2-layout.component';
import { EmitraLayoutComponent } from './Views/Shared/emitra-layout/emitra-layout.component';
import { BterPublicInfoLayoutComponent } from './Views/Shared/bter-publicinfo-layout/bter-publicinfo-layout.component';




// load this before app initiliaze
export function initializeApp(appsettingService: AppsettingService): () => any {
  return () => appsettingService.loadAppsetting().subscribe(appsetting => {
    appsettingService.setAppsetting(appsetting);
  });
}


@NgModule({
  declarations: [
    AppComponent,
    MasterLayoutComponent,
    HomeLayoutComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    Home2LayoutComponent,
    DTEApplicationLayoutComponent,
    EmitraLayoutComponent,
    BterPublicInfoLayoutComponent,
   
  ],
  imports: [
    ScrollingModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule ,
    NgScrollbarModule,
    MaterialModule,
    CommonModule,
    NgbModule,LoaderModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    NgIdleModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      enableHtml: true
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

  ],
  providers: [AuthGuard, SSOLoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    NgbActiveModal, MaterialModule,
    AppsettingService, {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppsettingService],
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}


