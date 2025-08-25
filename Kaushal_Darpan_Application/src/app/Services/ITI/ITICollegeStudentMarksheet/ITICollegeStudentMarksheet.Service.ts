import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITICollegeStudentMarksheetSearchModel } from '../../../Models/ITI/ITICollegeStudentMarksheetSearchModel';


@Injectable({
  providedIn: 'root'
})
export class ITICollegeMarksheetDownloadService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITICollegeMarksheetDownload";
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

  public async GetITICollegeList(searchRequest: ITICollegeStudentMarksheetSearchModel) {
        var body = JSON.stringify(searchRequest);
        return await this.http.post(`${this.APIUrl}/GetITICollege`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async GetITIStudent_Marksheet(searchRequest: ITICollegeStudentMarksheetSearchModel){
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/GetITICollegeStudent_Marksheet`, body, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    })
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

    public async ConsolidateTestMethod(searchRequest: ITICollegeStudentMarksheetSearchModel){
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/GetITICollegeStudent_Consolidate`, body, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    })
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }



    public async GetITIStudent_SCVTCertificate(searchRequest: ITICollegeStudentMarksheetSearchModel){
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/GetITIStudent_SCVTCertificate`, body, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    })
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }




}