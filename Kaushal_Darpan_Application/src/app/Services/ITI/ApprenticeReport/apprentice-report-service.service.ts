import { Injectable } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ApprenticeshipEntry, ApprenticeshipReportEntity, ApprenticeshipSubmission } from '../../../Models/ITI/ApprenticeshipReportModel';
//import { ApprenticeshipReportEntity } from '../../../Models/ITI/ApprenticeshipReportModel';
import { ITIApprenticeshipRegPassOutModel, ITIApprenticeshipWorkshopModel } from '../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { ITITimeTableSearchModel } from '../../../Models/ITI/ITITimeTableModels';


@Injectable({
  providedIn: 'root'
})
export class ApprenticeReportServiceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITINodalReport";
  readonly headersOptions: any;
 
  constructor(private formBuilder: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private http: HttpClient, private appsettingConfig: AppsettingService
  ) {
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


  public async Save_PMNAM_melaReport_BeforeAfter(Savemodel: any) {

    var body = JSON.stringify(Savemodel);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Save_PMNAM_melaRPT_BeforeAfter", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPMNAM_BeforeAfterAllData(Savemodel: any) {

    var body = JSON.stringify(Savemodel);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/GetPMNAM_BeforeAfterAllData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetQuaterProgressList(Savemodel: any) {

    var body = JSON.stringify(Savemodel);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/GetQuaterProgressList", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async PMNAM_report_DeletebyID(PKid: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/PMNAM_report_DeletebyID/" + PKid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetReportDatabyID(ID: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetReportDatabyID/" + ID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Save_PMNUM_Mela_Report(obj: ApprenticeshipReportEntity) {
    var body = JSON.stringify(obj);
    console.log(body);  
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Save_PMNUM_Mela_Report", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async Save_QuaterReport(obj: ITIApprenticeshipWorkshopModel) {
    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Save_QuaterReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetQuaterReportById(ID: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetQuaterReportById/" + ID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAAADetailsById(ID: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetAAADetailsById/" + ID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async QuaterListDelete(PKid: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/QuaterListDelete/" + PKid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAllData(UserID:number=0,DistrictID:number=0) {
    //var body = JSON.stringify(obj);
    // console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + "/GetAllData/" + UserID + '/' + DistrictID, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DeleteData_Pmnam_mela_Report(obj: ApprenticeshipReportEntity) {
    var body = JSON.stringify(obj);
     console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/DeleteData_Pmnam_mela_Report", body , { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  // Report 2 Workshop Progress Report
  public async Save_WorkshopProgressRPT(SaveModal: any) {
    var body = JSON.stringify(SaveModal);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Save_ITIWorkshopProgressRPT", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public Submit_Apprenticeship_data(payload: ApprenticeshipSubmission) {
    debugger;
    const body = JSON.stringify(payload);
    console.log('Submitting:', body);
    debugger;
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post(this.APIUrl + "/Submit_Apprenticeship_data", body, { headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_WorkshopProgressReportAllData(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Get_WorkshopProgressReportAllData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async WorkshopProgressRPTDelete_byID(PKid: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/WorkshopProgressRPTDelete_byID/" + PKid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Get_ApprenticeshipRegistrationReportAllData(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Get_ApprenticeshipRegistrationReportAllData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ApprenticeshipRegistrationRPTDelete_byID(PKid: number) {

    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/ApprenticeshipRegistrationRPTDelete_byID/" + PKid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SampleImportExcelFilePassout(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SampleImportExcelFilePassout`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SampleImportExcelFileFresher(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/SampleImportExcelFileFresher`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SavePassoutReport(obj: ITIApprenticeshipRegPassOutModel) {
    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/SavePassoutReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveFresherReport(obj: ITIApprenticeshipRegPassOutModel) {
    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/SaveFresherReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Get_PassingRegistrationReportAllData(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Get_PassingRegistrationReportAllData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Get_FresherRegistrationReportAllData(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/Get_FresherRegistrationReportAllData", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async PassOutRegistrationRPTDelete_byID(PKid: number) {
    //var body = JSON.stringify(obj);
    //console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/PassOutRegistrationRPTDelete_byID/" + PKid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async FresherRegistrationRPTDelete_byID(PKid: number) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/FresherRegistrationRPTDelete_byID/"  + PKid, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async MelaSampleImportExcelFile(searchRequest: ITITimeTableSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/MelaSampleImportExcelFile`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
