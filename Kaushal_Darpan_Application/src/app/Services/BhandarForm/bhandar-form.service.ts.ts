import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { Board_UniversityMasterModel, Board_UniversityMasterSearchModel } from '../../Models/Board_UniversityMasterModel';
import { AddBhandarFormDataModel, BhandarDetailsModel } from '../../Models/BhandarFormDataModel';


@Injectable({
  providedIn: 'root'
})
export class BhandarFormService {

  readonly APIUrl = this.appsettingConfig.apiURL + "BhandarFormMaster";
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
  //Get 

  public async GetByID(request: AddBhandarFormDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetExamStudentData/", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: AddBhandarFormDataModel) {

    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  

}






