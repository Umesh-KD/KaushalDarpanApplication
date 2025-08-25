

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { StudentSearchModel } from '../../Models/StudentSearchModel';
import { ApplicationMessageDataModel } from '../../Models/ApplicationMessageDataModel';
import { ForSMSEnrollmentStudentMarkedModel } from '../../Models/StudentMasterModels';

@Injectable({
  providedIn: 'root'
})
export class SMSMailService
{
  readonly APIUrl = this.appsettingConfig.apiURL + "SMSMail";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService)
  {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  handleErrorObservable(error: Response | any)
  {
    return throwError(error);
  }
  public async SendMessage(MobileNo: any, MessageType: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return await this.http.get(this.APIUrl + "/SendMessage/" + MobileNo + "/" + MessageType)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
  }

  public async SendApplicationMessage(request: ApplicationMessageDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SendApplicationMessage" , body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
  }

  public async SendSMSForStudentEnrollmentData(request: ForSMSEnrollmentStudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SendSMSForStudentEnrollmentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
