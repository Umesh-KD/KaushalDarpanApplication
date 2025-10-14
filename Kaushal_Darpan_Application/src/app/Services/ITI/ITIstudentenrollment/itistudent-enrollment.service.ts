import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { ChunksSearchModel, StudentMarkedModel, StudentMarkedModelForJoined, StudentMasterModel } from '../../../Models/StudentMasterModels';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../../Models/PreExamStudentDataModel';
import { NCVTChunkInfoDataModelDataPagingList } from '../../../Models/DataPagingListModel';

@Injectable({
  providedIn: 'root'
})
export class ITIStudentEnrollmentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIStudentEnrollment";
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

  // public async GetPreExamStudent(request: PreExamStudentDataModel) {
  //   const body = JSON.stringify(request);
  //   return await this.http.post(this.APIUrl + "/GetPreExamStudent", body, this.headersOptions)
  //     .pipe(
  //       catchError(this.handleErrorObservable)
  //     ).toPromise();
  // }

  public async GetStudentAdmitted(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetStudentAdmitted", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
 

  // public async EditStudentData_PreExam(request: StudentMasterModel) {
  //   const body = JSON.stringify(request);
  //   return await this.http.post(this.APIUrl + "/EditStudentData_PreExam", body, this.headersOptions)
  //     .pipe(
  //       catchError(this.handleErrorObservable)
  //     ).toPromise();
  // }

  // public async SaveData_PreExam_UpdateEnrollmentNo(request: PreExam_UpdateEnrollmentNoModel) {
  //   const body = JSON.stringify(request);
  //   return await this.http.post(this.APIUrl + "/PreExam_UpdateEnrollmentNo", body, this.headersOptions)
  //     .pipe(
  //       catchError(this.handleErrorObservable)
  //     ).toPromise();
  // }

  public async SaveAdmittedFinalStudentData(request: StudentMarkedModelForJoined[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveAdmittedFinalStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetNcvtStudentData_Chunks(request: ChunksSearchModel)
  {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetNcvtStudentData_Chunks", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UploadTraineeData(request: NCVTChunkInfoDataModelDataPagingList[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UploadTraineeData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



}
