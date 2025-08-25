import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels';
import { CenterMasterDataModels } from '../../Models/CenterMasterDataModels';
import { TimeTableDataModels, TimeTableInvigilatorModel, TimeTableSearchModel, TimeTableValidateModel } from '../../Models/TimeTableModels';
import { AppsettingService } from '../../Common/appsetting.service';
//import { CollegeMasteDataModels } from '../../Models/CollegeMasterDataModels';


@Injectable({
  providedIn: 'root'
})
export class TimeTableService {

  readonly APIUrl = this.appsettingConfig.apiURL + "TimeTable";
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

  //Sample Daownload In Excel

  public async GetSampleTimeTable(searchRequest: TimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetSampleTimeTable`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get 
  public async GetAllData(searchRequest: TimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData(request: TimeTableDataModels) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteDataByID(PK_ID: number, ModifyBy: number, DepartmentID: number = 0) {
    return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy + "/" + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTimeTableByID(ID: number) {
    return await this.http.get(this.APIUrl + "/GetTimeTableByID/" + ID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveInvigilator(request: TimeTableInvigilatorModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveInvigilator', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInvigilatorByID(ID: number, InstituteID: number) {
    return await this.http.get(this.APIUrl + "/GetInvigilatorByID/" + ID + "/" + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetTimeTableBranchSubject(searchRequest: TimeTableValidateModel)
  {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetTimeTableBranchSubject`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SampleImportExcelFile(file: any | null = null) {
    //formdata
    debugger;
    const formData = new FormData();
    formData.append("file", file);
    return await this.http.post(this.APIUrl + "/SampleImportExcelFile", formData)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveImportExcelData(ImportExcelList: any) {
    const body = JSON.stringify(ImportExcelList);
    return await this.http.post(this.APIUrl + '/SaveImportExcelData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveTimeTableWorkflow(request: any[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveTimeTableWorkflow', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async VerificationTimeTableList(searchRequest: TimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/VerificationTimeTableList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}






