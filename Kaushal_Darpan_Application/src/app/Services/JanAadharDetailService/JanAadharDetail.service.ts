import { Injectable } from '@angular/core';
import { StudentDetailUpdateModel } from '../../Models/StudentDetailUpdateModel';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { StudentEmploymentDetailsModel } from '../../Models/CompanyMasterDataModel';
import { StudentAdditionalQualificationModel } from '../../Models/ApplicationFormDataModel';
import { BTERStudentProfileUpdateModel } from '../../Models/StudentMasterModels';
import { NewJanAadharAPIModel } from '../../Models/NewJanAadharAPIModel';

@Injectable({
  providedIn: 'root'
})
export class JanAadharDetailService {
  readonly APIUrl = this.appsettingConfig.apiURL + "NewJanAadharDetail";
  readonly headersOptions: any;
  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

   public async SaveStudentProfileData(request: BTERStudentProfileUpdateModel) {
    debugger
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveStudentProfileData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


   //GetDetailsByJanAadhaar
  public async JanAadhaarMembersList(JAN_AADHAR: string) {

    const body = {}; 
    const params = new HttpParams()
      .set('sType', 'FetchMemberList')
      .set('JanaadhaarNo', JAN_AADHAR);
    return await this.http.post(`${this.APIUrl}/JanAdharDataNew`, body, { params })   
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  // send otp
  public async SendJanaadharOTP(row: NewJanAadharAPIModel) {
    debugger;
    var body = JSON.stringify(row);
    const params = new HttpParams()
      .set('sType', 'GenerateOTP')
      .set('memberId', row.MEMBER_ID)
      .set('SchemeName', 'EEMS');
    return await this.http.post(`${this.APIUrl}/JanAdharDataNew`, body, { params })
      .pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  // send otp
  public async VerifyOTP(row: NewJanAadharAPIModel) {
    debugger;
    var body = JSON.stringify(row);
    const params = new HttpParams()
      .set('sType', 'ValidateOTP_FetchRequestedData')
      .set('memberId', row.MEMBER_ID)
      .set('tid', row.tid)
      .set('OTP', row.OTP)
      .set('SchemeName', 'EEMS');
    return await this.http.post(`${this.APIUrl}/JanAdharDataNew`, body, { params })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }





  

}
