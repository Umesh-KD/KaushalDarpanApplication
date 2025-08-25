import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { TimeTableSearchModel, TimeTableDataModels, TimeTableInvigilatorModel, TimeTableValidateModel } from '../../../Models/TimeTableModels';
import { ITITimeTableSearchModel } from '../../../Models/ITI/ITITimeTableModels';
import { ItiInvigilatorDatAModel, ItiInvigilatorSearchModel, ITITheorySearchModel } from '../../../Models/ITI/ItiInvigilatorDataModel';

@Injectable({
  providedIn: 'root'
})

export class ITIInvigilatorService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIInvigilator";
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


  //Get 
  public async GetAllData(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
    ).toPromise();



  }


  //Get 
  public async GetInvigilatorList(searchRequest: ItiInvigilatorSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllInvigilator`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();



  }



  public async SaveData(request: ItiInvigilatorDatAModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveInvigilator`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  

 
  //Get 
  public async GetAllTheoryStudents(searchRequest: ITITheorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllTheoryStudents`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

   
  
  public async GetInvigilatorDataUserWise(searchreq: any) {
    var body = JSON.stringify(searchreq);
    return await this.http.post(`${this.APIUrl}/GetInvigilatorData_UserWise`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Iti_InvigilatorPaymentGenerateAndViewPdf(model: any): Promise<any> { 
    return this.http.post(`${this.APIUrl}/Iti_InvigilatorPaymentGenerateAndViewPdf`, model, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    }).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SavePDFSubmitAndForwardToAdmin(payload: any) {
    var body = JSON.stringify(payload);
    return await this.http.post(`${this.APIUrl}/Iti_InvigilatorSubmitandForwardToAdmin`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetItiRemunerationInvigilatorAdminDetails(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetItiRemunerationInvigilatorAdminDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateToApprove(updateRequest: any) {
    var body = JSON.stringify(updateRequest);
    return await this.http.post(`${this.APIUrl}/UpdateToApprove/`, body , this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async GetinvigilatorDetailbyRemunerationID(RemunerationID: any) {
    //var body = JSON.stringify(updateRequest);
    return await this.http.post(`${this.APIUrl}/GetinvigilatorDetailbyRemunerationID/` + RemunerationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetRemunerationApproveList(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetRemunerationApproveList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
