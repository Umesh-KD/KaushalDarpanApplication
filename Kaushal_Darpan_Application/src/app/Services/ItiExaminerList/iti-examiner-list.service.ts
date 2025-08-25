import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ItiExaminerDataModel, ItiExaminerSearchModel, ITITeacherForExaminerSearchModels } from '../../Models/ItiExaminerDataModel';
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class ItiExaminerListService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ItiExaminer";
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

  public async GetAllData(searchRequest: ItiExaminerSearchModel) {
    
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByID(PK_ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: ItiExaminerDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DeleteAssignedStudentsByExaminerID(ExaminerID: number) {
    return await this.http
      .delete(`${this.APIUrl}/DeleteAssignedStudents/${ExaminerID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .toPromise();
  }

  //post
  public async GetTeacherForExaminerById(request: ITITeacherForExaminerSearchModels) {
    return await this.http
      .post(`${this.APIUrl}/GetTeacherForExaminerById`, request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      )
      .toPromise();
  }

}
