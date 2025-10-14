import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { SeatIntakeDataModel, SeatIntakeSearchModel, ITICollegeTradeSearchModel } from '../../../Models/ITI/SeatIntakeDataModel';
import { SanctionOrderModel } from '../../../Models/ITI/UserRequestModel';
import { SeatIntakesDataListSearchModel } from '../../../Models/ITI/IITIDataMasterDataModel';
import { ITIStudentCorrectionMasterSearchModel } from '../../../Models/StudentMasterModels';

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


  
   //Get iti student list for correction
    public async GetStudentCorrectionListData(searchRequest: ITIStudentCorrectionMasterSearchModel) {
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/GetStudentCorrectionListData`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }


  
         //Get studetn list eligible for placement all data
    public async GetStudentCorrectionDataByID(searchRequest: ITIStudentCorrectionMasterSearchModel) {
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/GetStudentCorrectionDataByID`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
  

      public async SaveStudentCorrectionData(searchRequest: ITIStudentCorrectionMasterSearchModel) {
      const body = JSON.stringify(searchRequest);
      return await this.http.post(this.APIUrl + '/SaveStudentCorrectionData', body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }


}
