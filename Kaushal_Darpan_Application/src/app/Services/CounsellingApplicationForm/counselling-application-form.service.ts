import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { Counselling_DropdownDataModel, Counselling_OptionFormDataModel, CounsellingApplicationFormDataModel, CounsellingApplicationSearchModel } from '../../Models/CounsellingApplicationFormDataModel';

@Injectable({
  providedIn: 'root'
})
export class CounsellingApplicationFormService {
  readonly APIUrl = this.appsettingConfig.apiURL + "CounsellingApplicationForm";
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

  public async SavePersonalDetails(request: CounsellingApplicationFormDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SavePersonalDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationDataByID_Counselling(request: CounsellingApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetApplicationDataByID_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Counselling_GetDropdownByAction(request: Counselling_DropdownDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Counselling_GetDropdownByAction`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Counselling_SaveOption(request: Counselling_OptionFormDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Counselling_SaveOption`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Counselling_GetOptionDetailsByID(request: Counselling_OptionFormDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Counselling_GetOptionDetailsByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async MapCandidateSSO(request: CounsellingApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/MapCandidateSSO`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateCandidateSsoMapping(searchRequest: CounsellingApplicationSearchModel)

  {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/UpdateCandidateSsoMapping`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
