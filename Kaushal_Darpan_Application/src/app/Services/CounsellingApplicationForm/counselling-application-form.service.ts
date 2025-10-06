import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { Counselling_DropdownDataModel, Counselling_OptionFormDataModel, CounsellingApplicationFormDataModel, CounsellingApplicationSearchModel, InstituteListDataModel_Coun } from '../../Models/CounsellingApplicationFormDataModel';
import { Counselling_DocumentDetailsModel } from '../../Models/DocumentDetailsModel';

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


    public async UpdateCandidateSsoMapping(searchRequest: CounsellingApplicationSearchModel) {
        const body = JSON.stringify(searchRequest);
        return await this.http.post(`${this.APIUrl}/UpdateCandidateSsoMapping`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }


  public async DeleteOptionByID_Counselling(request: Counselling_OptionFormDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteOptionByID_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async PriorityChange_Counselling(request: Counselling_OptionFormDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PriorityChange_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDocumentDatabyID_Counselling(request: CounsellingApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDocumentDatabyID_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDocumentData_Counselling(request: Counselling_DocumentDetailsModel[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveDocumentData_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PreviewData_ByID_Counselling(request: CounsellingApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PreviewData_ByID_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteChildOptionByID_Counselling(request: InstituteListDataModel_Coun) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteChildOptionByID_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async ChildPriorityChange_Counselling(request: InstituteListDataModel_Coun) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ChildPriorityChange_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApplicationFinalSubmit_Counselling(request: CounsellingApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ApplicationFinalSubmit_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInstituteOptionList_Counselling(request: InstituteListDataModel_Coun) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetInstituteOptionList_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDocumentById_Counselling(request: Counselling_DocumentDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteDocumentById_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockApplication_Counselling(request: CounsellingApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/UnlockApplication_Counselling`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
