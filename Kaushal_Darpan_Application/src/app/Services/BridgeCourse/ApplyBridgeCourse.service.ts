import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { PromotedStudentMarkedModel, PromotedStudentSearchModel } from '../../Models/PrometedStudentMasterModel';
import { BridgeCourseStudentMarkedModel, BridgeCourseStudentSearchModel } from '../../Models/ApplyBridgeCourseDataModel';

@Injectable({
  providedIn: 'root'
})
export class BridgeCourseStudentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ApplyBridgeCourse";
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

  public async GetAllStudent(request: BridgeCourseStudentSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllStudent`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async SaveStudent(request: BridgeCourseStudentMarkedModel[]) {
      const body = JSON.stringify(request);
      return this.http.post(`${this.APIUrl}/SaveStudent`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
}
