import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { AppsettingService } from '../../Common/appsetting.service';
import { RecheckDocumentModel } from '../../Models/StudentMeritInfoDataModel';
import { StudentSearchModel } from '../../Models/StudentSearchModel';
import { VerifierDataModel } from '../../Models/VerifierDataModel';
import { StudentEnrolmentCancelModel } from '../../Models/StudentDetailsModel';

@Injectable({
  providedIn: 'root'
})

export class StudentEnrollmentCancelationService {
  readonly APIUrl = this.appsettingConfig.apiURL + "EnrollmentCancelation";
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

  public async GetStudentDashboard(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ChangeEnRollNoStatus(request: StudentEnrolmentCancelModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/ChangeEnRollNoStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEnrollCancelationData(request: StudentEnrolmentCancelModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetEnrollCancelationData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllData(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllFinalEnrData(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetFinalEnrollCancellationList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
    }
    public async GetEnrollmentCancelList(searchRequest: StudentSearchModel) {
        const body = JSON.stringify(searchRequest);

        return await this.http.post(`${this.APIUrl}/GetEnrollmentCancelList`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }


  public async CancelEnrolment(Request: StudentEnrolmentCancelModel) {
    const body = JSON.stringify(Request);

    return await this.http.post(`${this.APIUrl}/CancelEnrolment `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async ITIGetAllData(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ITIGetAllData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDeatilsByAction(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentDeatilsByAction`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentDeatilsByAction(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIStudentDeatilsByAction`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async UpdateStudentSsoMapping(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/UpdateStudentSsoMapping`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetProfileDashboard(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetProfileDashboard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AddStudentData(request: VerifierDataModel) {
    var body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/AddStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDocumentData(Request: RecheckDocumentModel[]) {
    const body = JSON.stringify(Request);
    return await this.http.post(`${this.APIUrl}/SaveRecheckData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentMeritinfo(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetITIStudentMeritinfo `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentApplication(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetStudentApplication `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetReverApplication(searchRequest: StudentSearchModel) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetReverApplication `, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


}
