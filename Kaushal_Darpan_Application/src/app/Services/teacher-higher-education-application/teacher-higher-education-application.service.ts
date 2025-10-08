import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { TeacherHigherEducationApplicationRequestModel, TeacherHigherEducationApplicationSaveModel } from '../../Models/TeacherHigherEducationApplicationDataModel';


@Injectable({
  providedIn: 'root'
})
export class TeacherHigherEducationApplicationService {
  readonly APIUrl = this.appsettingConfig.apiURL + "TeacherHigherEducationApplication";
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

  public async GetEnrolledStudent_Promoted(request: TeacherHigherEducationApplicationRequestModel) {
    return await this.http.post(this.APIUrl + "/GetEnrolledStudent_Promoted", request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    
  public async SaveTeacherHighEduApp(request: TeacherHigherEducationApplicationSaveModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEnrolledStudentVerify_ReturnbyExamIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
