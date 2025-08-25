import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ITI_InstructorDataModel, ITI_InstructorDataSearchModel, ITI_InstructorGridDataSearchModel, ITI_InstructorDataBindSearchModel } from '../../../Models/ITI/ItiInstructorDataModel';



@Injectable({
  providedIn: 'root'
})


export class ITI_InstructorService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ItiInstructor";
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

 public async SaveInstructorData(request: ITI_InstructorDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveInstructorData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetInstructorDataByID(id: number) {
     return await this.http.get(`${this.APIUrl}/GetInstructorDataByID/${id}`, this.headersOptions)
       .pipe(
         catchError(this.handleErrorObservable)
       ).toPromise();
  }

 public async GetInstructorData(searchRequest: ITI_InstructorDataSearchModel) {
        var body = JSON.stringify(searchRequest);
        return await this.http.post(`${this.APIUrl}/GetInstructorData`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

      public async deleteInstructorDataByID(id: number) {
     return await this.http.get(`${this.APIUrl}/deleteInstructorDataByID/${id}`, this.headersOptions)
       .pipe(
         catchError(this.handleErrorObservable)
       ).toPromise();
  }

  public async GetGridInstructorData(searchRequest: ITI_InstructorGridDataSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetGridInstructorData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetGridBindInstructorData(searchRequest: ITI_InstructorDataBindSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetGridBindInstructorData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
