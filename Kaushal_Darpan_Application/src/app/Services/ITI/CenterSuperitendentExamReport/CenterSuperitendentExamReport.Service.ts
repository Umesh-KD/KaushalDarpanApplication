import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CenterSuperitendentExamReportModel } from '../../../Models/ITI/CenterSuperitendentExamReportModel';


@Injectable({
  providedIn: 'root'
})


export class CenterSuperitendentExamReportService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITICenterSuperitendentExamReport";
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

 public async SaveData_CenterSuperitendentExamReport(request: CenterSuperitendentExamReportModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetByID(id: number) {
     return await this.http.get(`${this.APIUrl}/GetCenterSuperitendentReportById/${id}`, this.headersOptions)
       .pipe(
         catchError(this.handleErrorObservable)
       ).toPromise();
  }

//  public async GetCenterSuperitendentReportData(searchRequest: CenterSuperitendentExamReportModel) {
//         var body = JSON.stringify(searchRequest);
//         return await this.http.post(`${this.APIUrl}/GetITICollege`, body, this.headersOptions)
//             .pipe(
//                 catchError(this.handleErrorObservable)
//             ).toPromise();
//     }
 public async GetCenterSuperitendentReportData() {
        // var body = JSON.stringify();
        return await this.http.post(`${this.APIUrl}/GetCenterSuperitendentReportData`, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }
}
