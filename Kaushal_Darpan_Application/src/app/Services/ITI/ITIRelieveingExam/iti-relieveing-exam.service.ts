import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ITICoordinatorRelievingForm, ITIExaminerRelievingModel } from '../../../Models/ITI/ITIRelievingFormModel';
import { UndertakingExaminerFormModel } from '../../../Models/ITI/UndertakingExminerFormModel';

@Injectable({
  providedIn: 'root'
})
export class ITIRelievingExamService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIRelievingExam";
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

  public async SaveRelievingExaminerData(request: ITIExaminerRelievingModel) {
    const body = JSON.stringify(request);
   

    return await this.http.post(this.APIUrl + "/SaveRelievingExaminerData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


   public async SaveRelievingCoOrdinatorData(request: ITICoordinatorRelievingForm) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveRelievingCoOrdinatorData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


   public async GetByID(id: number) {
     return await this.http.get(`${this.APIUrl}/GetRelievingExaminerById/${id}`, this.headersOptions)
       .pipe(
         catchError(this.handleErrorObservable)
       ).toPromise();
  }



  //one more GetById
  public async GetByExamCoordinatorId(id: number) {
    return await this.http.get(`${this.APIUrl}/GetRelievingByExamCoordinatorId/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //Get Details by SSoId
  public async GetDetailsBySSOId(SSOID: number) {
    var body = JSON.stringify(SSOID);
    return await this.http.get(`${this.APIUrl}/GetDataBySSOId/${SSOID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveUndertakingExaminerData(request: UndertakingExaminerFormModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveUndertakingExaminerData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDetailbyID(id: number) {
    return await this.http.get(`${this.APIUrl}/GetUndertakingExaminerDetailsById/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterList(Userid: number) {
    return await this.http.get(`${this.APIUrl}/GetCenterListByUserid/${Userid}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




  public async GetUndertakingtExaminerById(id: number) {
    return await this.http.get(`${this.APIUrl}/GetUndertakingtExaminerById/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
