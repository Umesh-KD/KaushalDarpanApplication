import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../Common/appsetting.service';
import { EmitraRequestDetails, EmitraServiceAndFeeRequestModel, TransactionStatusDataModel } from '../../Models/PaymentDataModel';
import { StudentSearchModel } from '../../Models/StudentSearchModel';

@Injectable({
  providedIn: 'root'
})
export class EmitraPaymentService
{
  readonly APIUrl = this.appsettingConfig.apiURL + "EmitraPaymentService";
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

  public async EmitraPayment(request: EmitraRequestDetails) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraPayment", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EmitraPaymentITI(request: EmitraRequestDetails) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraPaymentITI", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async EmitraApplicationPayment(request: EmitraRequestDetails) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraApplicationPayment", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async EmitraApplicationPaymentNew(request: EmitraRequestDetails) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraApplicationPaymentNew", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEmitraTransactionDetails(PRnNO?: string) {
    return await this.http.get(this.APIUrl + "/GetEmitraTransactionDetails/" + PRnNO, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetEmitraITITransactionDetails(PRnNO?: string) {
    return await this.http.get(this.APIUrl + "/GetEmitraITITransactionDetails/" + PRnNO, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }








  public async GetEmitraApplicationTransactionDetails(PRnNO?: string) {
    return await this.http.get(this.APIUrl + "/GetEmitraApplicationTransactionDetails/" + PRnNO, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

  public async GetTransactionDetailsActionWise(request: StudentSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetTransactionDetailsActionWise", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTransactionStatus(request: TransactionStatusDataModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetTransactionStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EmitraApplicationVerifyPaymentStatus(request: TransactionStatusDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraApplicationVerifyPaymentStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EmitraApplicationVerifyPaymentStatusNew(request: TransactionStatusDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraApplicationVerifyPaymentStatusNew", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EmitraCollegePayment(request: EmitraRequestDetails) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraCollegePayment", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EmitraCollegePaymentNew(request: EmitraRequestDetails) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraCollegePaymentNew", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEmitraServiceAndFeeData(request: EmitraServiceAndFeeRequestModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetEmitraServiceAndFeeData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEmitraCollegeTransactionDetails(PRnNO?: string) {
    return await this.http.get(this.APIUrl + "/GetEmitraCollegeTransactionDetails/" + PRnNO, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EmitraExaminationBackToBackITI(request: EmitraRequestDetails)
  {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EmitraExaminationBackToBackITI", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
