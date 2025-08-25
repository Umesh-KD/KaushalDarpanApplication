import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { StudentVerificationDocumentsDataModel, StudentVerificationSearchModel, VerificationDocumentDetailList } from '../../Models/StudentVerificationDataModel';
import { DocumentScrutinyDataModel, RejectModel } from '../../Models/DocumentScrutinyDataModel';
import { BterSearchmodel } from '../../Models/ApplicationFormDataModel';
import { ItiDocumentscrutinymodel } from '../../Models/ITI/ItiDocumentScrutinyDataModel';

@Injectable({
  providedIn: 'root'
})

export class ItiDocumentscrutinyService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ItiDocumentScrutiny";
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

  //Get all data
 

  public async Save_Documentscrutiny(request: ItiDocumentscrutinymodel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_Documentscrutiny", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


 
  public async DocumentScrunityData(request: BterSearchmodel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/DocumentScrunityData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
