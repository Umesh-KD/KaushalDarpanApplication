import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { AddressDetailsDataModel, DocumentDetailList, DocumentDetailsDataModel, ITI_DirectAdmissionApplyDataModel, OptionsDetailsDataModel, PersonalDetailsDatamodel, QualificationDetailsDataModel } from '../../Models/ITIFormDataModel';
import { ItiApplicationSearchmodel, ItiApplicationUnlockDataModel } from '../../Models/ItiApplicationPreviewDataModel';
import { BterCollegesSearchModel } from '../../Models/ApplicationFormDataModel';
import { DocumentDetailsModel } from '../../Models/DocumentDetailsModel';
import { ItiApplicationDataModel, ItiDashApplicationSearchModel } from '../../Models/ItiApplicationDataModel';

@Injectable({
  providedIn: 'root'
})
export class ItiApplicationFormService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ItiApplicationForm";
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

  public async SavePersonalDetailsData(request: PersonalDetailsDatamodel) {
    var body = JSON.stringify(request);
    
    return await this.http.post(`${this.APIUrl}/SavePersonalDetailsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationDatabyID(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetApplicationDatabyID/` ,body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveOptionDetailsData(request: OptionsDetailsDataModel[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveOptionDetailsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveQualificationDetailsData(request: QualificationDetailsDataModel[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveQualificationDetailsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDocumentDetailsData(request: DocumentDetailsModel[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveDocumentDetailsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAddressDetailsData(request: AddressDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveAddressDetailsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAddressDetailsbyID(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAddressDetailsbyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetQualificationDatabyID(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetQualificationDatabyID` , body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetOptionDetailsbyID(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetOptionDetailsbyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationPreviewbyID(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetApplicationPreviewbyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDocumentDatabyID(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetDocumentDatabyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async FinalSubmit(ApplicationID: number, Status: number) {

    return await this.http.post(`${this.APIUrl}/FinalSubmit/${ApplicationID}/${Status}`, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
  }


  public async GetITIStudentProfileDownload(searchRequest: ItiApplicationSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetITIStudentProfileDownload`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteOptionByID(request: OptionsDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteOptionByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PriorityChange(request: OptionsDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PriorityChange`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UnlockApplication(request: ItiApplicationUnlockDataModel) {
    var body = JSON.stringify(request);
    
    return await this.http.post(`${this.APIUrl}/UnlockApplication`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

   public async GetItiApplicationData(request: ItiDashApplicationSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetItiApplicationData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITI_DirectAdmissionApply(request: ITI_DirectAdmissionApplyDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/ITI_DirectAdmissionApply`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 
}
