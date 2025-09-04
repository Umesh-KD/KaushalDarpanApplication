import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { AppointExaminerSearchModel, AppointmentExaminerDataModel } from '../../Models/AppointExaminerDataModel';
import { ApplicationDatamodel, BterAddressDataModel, BterDocumentsDataModel, BterOptionsDetailsDataModel, BterOtherDetailsModel, BterSearchmodel, DirectAdmissionUpdatePayment, DocumentDetailList, DTEDashApplicationSearchModel, HighestQualificationModel, QualificationDataModel } from '../../Models/ApplicationFormDataModel';
import { DocumentDetailsModel } from '../../Models/DocumentDetailsModel';
import { HighestQualificationDetailsDataModel } from '../../Models/ITIFormDataModel';


@Injectable({
  providedIn: 'root'
})
export class BterApplicationForm {

  readonly APIUrl = this.appsettingConfig.apiURL + "BterApplication";
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

  public async DeleteByID(request: HighestQualificationModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDetailsbyID(request: HighestQualificationModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetDetailsbyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveQualificationData(request: QualificationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveQualificationData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveHighQualificationData(request: QualificationDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveHighQualificationData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SavePersonalData(request: ApplicationDatamodel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SavePersonalData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetApplicationDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAddressDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAddressDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetOtherDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetOtherDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetQualificationDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetQualificationDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDocumentDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetDocumentDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetOptionalDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetOptionalDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveAddressData(request: BterAddressDataModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveAddressData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDocumentData(request: DocumentDetailsModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveDocumentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveOtherData(request: BterOtherDetailsModel) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveOtherData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveOptionalData(request: BterOptionsDetailsDataModel[]) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveOptionalData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetPreviewDatabyID(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetPreviewDatabyID`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentProfileDownload(searchRequest: BterSearchmodel) {
    var body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetStudentProfileDownload`, searchRequest, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

 

  
  public async SavefinalData(ApplicationID: number, Status: number) {

    return await this.http.post(`${this.APIUrl}/SaveFinalData/${ApplicationID}/${Status}`, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

  public async DeleteOptionByID(request: BterOptionsDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteOptionByID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PriorityChange(request: BterOptionsDetailsDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PriorityChange`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteDocumentById(request: DocumentDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DeleteDocumentById`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DirectAdmissionPaymentUpdate(request: DirectAdmissionUpdatePayment) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/DirectAdmissionPaymentUpdate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async JailAdmissionFinalSubmit(request: DirectAdmissionUpdatePayment) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/JailAdmissionFinalSubmit`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
