import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ItiCenterMasterDataModels } from '../../Models/ItiCenterMasterDataModels';
import { AppsettingService } from '../../Common/appsetting.service';
import { CenterAllocationSearchModel } from '../../Models/CenterAllocationDataModels';
import { AssignApplicationSearchModel } from '../../Models/DTE_AssignApplicationDataModel';
import { ItiAssignExaminerSearchModel, ITIExaminerDataModelSearchFilters, ITIPracticalExaminerSearchFilters } from '../../Models/ITI/AssignExaminerDataModel';
import { ITI_AppointExaminerDetailsModel, ITI_ExaminerDashboardModel } from '../../Models/ITI/ITI_ExaminerDashboard';


@Injectable({
  providedIn: 'root'
})
export class ItiAssignExaminerService {

  readonly APIUrl = this.appsettingConfig.apiURL + "ITIPracticalExaminer";
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
  public async GetAllData(Request: ItiAssignExaminerSearchModel) {
    return await this.http.post(this.APIUrl + "/GetPracticalExamCenter", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Getstaffpractical(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/Getstaffpractical', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  //public async GetByID(PK_ID: number) {
  //  return await this.http.get(this.APIUrl + "/GetByID/" + PK_ID, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async AssignPracticalExaminer(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/AssignPracticalExaminer', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  //public async DeleteDataByID(PK_ID: number, ModifyBy: number) {
  //  return await this.http.delete(this.APIUrl + '/DeleteDataByID/' + PK_ID + "/" + ModifyBy, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  //public async SaveCenterData(selectedColleges: any[], StartValue: number) {
  //  const body = JSON.stringify(selectedColleges); // Serialize the selected colleges

  //  return await this.http.post(this.APIUrl + `/SaveSSOIDData?StartValue=${StartValue}`, body, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  //public async DownloadItiPracticalExaminer(id: number) {
  //  return await this.http.post(this.APIUrl + "/DownloadItiPracticalExaminer/${}", this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}
  public async DownloadItiPracticalExaminer(id: number) {

    return await this.http.post(`${this.APIUrl}/DownloadItiPracticalExaminer/${id}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterPracticalexaminer(Request: ItiAssignExaminerSearchModel) {
    return await this.http.post(this.APIUrl + "/GetCenterPracticalexaminer", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterPracticalexaminerReliving(Request: ITIPracticalExaminerSearchFilters) {
    return await this.http.post(this.APIUrl + "/GetCenterPracticalexaminerReliving", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPracticalExaminerRelivingByUserId(Request: ITIPracticalExaminerSearchFilters) {
    return await this.http.post(this.APIUrl + "/GetPracticalExaminerRelivingByUserId", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Get 
  public async GeneratePracticalExamAssignData(Request: ItiAssignExaminerSearchModel) {
    return await this.http.post(this.APIUrl + "/GeneratePracticalExamAssignData", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetStudentExamReportGetStudentExamReportForITIAsync(Request: ITIExaminerDataModelSearchFilters) {
    return await this.http.post(this.APIUrl + "/GetStudentExamReportForITI", Request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SavePDFSubmitAndForwardToAdmin(model: ITI_AppointExaminerDetailsModel) {
    return await this.http.post(`${this.APIUrl}/SavePDFSubmitAndForwardToAdmin`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetItiRemunerationAdminDetails(request: ITI_AppointExaminerDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetItiRemunerationAdminDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateToApprove(model: ITI_AppointExaminerDetailsModel) {
    return await this.http.post(`${this.APIUrl}/UpdateToApprove`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetItiRemunerationExaminerDetails(request: ITI_AppointExaminerDetailsModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetItiRemunerationExaminerDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Iti_RemunerationGenerateAndViewPdf(model: ITI_AppointExaminerDetailsModel): Promise<any> {
    debugger;
    return this.http.post(`${this.APIUrl}/Iti_RemunerationGenerateAndViewPdf`, model, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    }).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async NcvtUpdateStudentExamMarksData(request: any[]) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/NcvtUpdateStudentExamMarksData', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}






