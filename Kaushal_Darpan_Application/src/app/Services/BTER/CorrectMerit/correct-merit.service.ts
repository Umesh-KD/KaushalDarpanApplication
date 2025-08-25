import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SeatIntakeDataModel, SeatIntakeSearchModel, ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { CorrectMeritSearchModel, MeritDocumentScrutinyDataModel } from '../../../Models/BTER/CorrectMeritDataModel';
import { BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { CorrectMerit_ApplicationSearchModel, CorrectMeritApproveDataModel, RejectModel } from '../../../Models/DocumentScrutinyDataModel';

@Injectable({
  providedIn: 'root'
})


export class CorrectMeritService {

  readonly APIUrl = this.appsettingConfig.apiURL + "CorrectMerit";
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


  public async CorrectMeritList(request: CorrectMeritSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/CorrectMeritList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async MeritDocumentScrunityData(request: BterSearchmodel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/MeritDocumentScrunityData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Save_MeritDocumentscrutiny(request: MeritDocumentScrutinyDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Save_MeritDocumentscrutiny", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async Reject_Document(request: RejectModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Reject_Document", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationIDByMeritID(request: CorrectMerit_ApplicationSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetApplicationIDByMeritID", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApproveMerit(request: CorrectMeritApproveDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ApproveMerit", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async NotifyCanditate_Merit(request: CorrectMeritApproveDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/NotifyCanditate_Merit", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
