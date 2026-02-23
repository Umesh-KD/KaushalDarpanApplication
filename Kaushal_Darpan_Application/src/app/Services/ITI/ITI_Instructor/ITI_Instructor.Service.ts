import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ITI_InstructorDataModel, ITI_InstructorDataSearchModel, ITI_InstructorGridDataSearchModel, ITI_InstructorDataBindSearchModel, ITI_InstructorDataAssignSearchModel, ITI_Instructor_TechCITSDetailsSearchModel } from '../../../Models/ITI/ItiInstructorDataModel';



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


  public async GetGridBindInstructorData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetGridBindInstructorData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetInstructorDataBySsoid(SSOID: string) {
    return await this.http.post(`${this.APIUrl}/GetInstructorDataBySsoid/${SSOID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateInstructorData(request: ITI_InstructorDataModel) {

    const body = JSON.stringify(request);
    console.log(body);
    return await this.http.post(this.APIUrl + "/UpdateInstructorData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .toPromise();
  }


  public async GetInstructorListIsAssign(searchRequest: ITI_InstructorDataAssignSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetInstructorListIsAssign`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetInstructorAssignStatus(Uid: string) {
    return await this.http.post(`${this.APIUrl}/GetInstructorListIsAssignStatus/${Uid}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllTechCITSDetails(request: ITI_Instructor_TechCITSDetailsSearchModel) {
    const body = JSON.stringify(request);

    return await this.http.post(this.APIUrl + "/GetAllTechCITSDetails", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveItiworkflow(request: any) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/SaveItiworkflow`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetverificationStatus(request: any) {
    var body = JSON.stringify(request);

    return await this.http.post(`${this.APIUrl}/GetverificationStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveOptionDetailsData(request: any[]) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/SaveOptionDetailsData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetOptionDetailsbyID(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetOptionDetailsbyID`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PriorityChange(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/PriorityChange`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async Onfinaljoin(request: any) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/Onfinaljoin`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
