import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CommonSubjectMasterSearchModel } from '../../Models/CommonSubjectMasterSearchModel';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { HrMasterDataModel, HrMasterSearchModel } from '../../Models/HrMasterDataModel';
import { CompanyMasterDataModels, CompanyMasterSearchModel, CompanyMaster_Action } from '../../Models/CompanyMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { AddCollegeWiseScholarshipModel } from '../../Models/CollegeWiseScholarshipModel';
import { AddITICollegeWiseScholarshipModel } from '../../Models/ITICollegeWiseScholarshipModel';


@Injectable({
  providedIn: 'root'
})
export class ITICollegeWiseScholarshipService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITICollegeWiseScholarship";
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

 
 
  public async GetCollegeWiseScholarshipList(searchRequest: CompanyMasterSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCollegeWiseScholarshipList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSchemeType(){
    return await this.http.get(`${this.APIUrl}/GetSchemeList`,this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetScholershipType(){
    return await this.http.get(`${this.APIUrl}/GetTypeList`,this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async SaveCollegeWiseScholarshipDetails(data: AddITICollegeWiseScholarshipModel[]) {
    var body = JSON.stringify(data);
    return await this.http.post(`${this.APIUrl}/SaveCollegeWiseScholarshipDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDetailsById(id:number){
    return await this.http.get(`${this.APIUrl}/GetDetailsById/${id}`,this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }




}
