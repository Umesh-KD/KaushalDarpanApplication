import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { StudentSearchModel } from '../../Models/StudentSearchModel';
import { VerificationDocumentDetailList } from '../../Models/StudentVerificationDataModel';
import { DocumentDetailsModel } from '../../Models/DocumentDetailsModel';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStatusService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ApplicationStatus";
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

  public async StudentApplicationStatus(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/StudentApplicationStatus`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  
  public async GetByID(ApplicationID: number) {

    return await this.http.post(`${this.APIUrl}/GetByID` , ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDocumentData(Request: DocumentDetailsModel[]) {
    const body = JSON.stringify(Request);
    return await this.http.post(`${this.APIUrl}/SaveRevertData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }




}
