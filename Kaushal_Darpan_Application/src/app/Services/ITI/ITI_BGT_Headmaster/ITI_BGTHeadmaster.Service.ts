import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ITI_InstructorDataModel, ITI_InstructorDataSearchModel } from '../../../Models/ITI/ItiInstructorDataModel';
import { ITI_BGT_HeadMasterDataModel } from '../../../Models/ITI/ItiBGTHeadMasterDataModel';



@Injectable({
  providedIn: 'root'
})


export class ITI_BGTHeadmasterService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ItiBGTHeadmaster";
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

  public async SaveBGTHeadmasterData(request: ITI_BGT_HeadMasterDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/SaveBGTHeadmasterData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetBGTHeadmasterDataByID(id: number) {
    return await this.http.get(`${this.APIUrl}/GetBGTHeadmasterDataByID/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBGTHeadmasterData() {
    var body = JSON.stringify({});
    return await this.http.post(`${this.APIUrl}/GetBGTHeadmasterData`, body, this.headersOptions)
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
}
