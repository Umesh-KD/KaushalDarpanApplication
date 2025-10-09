import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { SeatIntakeDataModel, SeatIntakeSearchModel, ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { SanctionOrderModel } from '../../../Models/ITI/UserRequestModel';
import { SeatIntakesDataListSearchModel } from '../../../Models/ITI/IITIDataMasterDataModel';

@Injectable({
  providedIn: 'root'
})
export class ItiDataMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIDataMaster";
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



  public async GetAllData(request: SeatIntakesDataListSearchModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
