import { Injectable } from '@angular/core';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { RevertDataModel, Student_DataModel, StudentAttendenceModel, StudentMarkedModel, StudentMasterModel } from '../../../Models/StudentMasterModels';
import { CommonSubjectDetailsMasterModel } from '../../../Models/CommonSubjectDetailsMasterModel';
import { ITIExamination_UpdateEnrollmentNoModel, ITIExaminationOptionalSubjectRequestModel, ITIExaminationStudentDataModel } from '../../../Models/ITIExaminationDataModel';
import { PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';

@Injectable({
  providedIn: 'root'
})


export class StudentExaminationITIService {
  readonly APIUrl = this.appsettingConfig.apiURL + "ITIExamination";
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

  public async GetPreExamStudent(request: ITIExaminationStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPreExamStudent", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPreEnrollStudent(request: ITIExaminationStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPreEnrollStudent", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async EditStudentData_PreExam(request: StudentMasterModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/EditStudentData_PreExam", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveData_PreExam_UpdateEnrollmentNo(request: ITIExamination_UpdateEnrollmentNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/PreExam_UpdateEnrollmentNo", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentSubject_ByID(StudentID: number, DepartmentID: number = 0) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/GetStudentSubject_ByID/' + StudentID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async RevertStatus(reevert: RevertDataModel) {
    const body = JSON.stringify(reevert);
    return await this.http.post(this.APIUrl + "/RevertStatus", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveSelectedForExamination(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveSelectedForExamination`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveEligibleForExamination(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEligibleForExamination`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Save_Student_Subject(
    request: CommonSubjectDetailsMasterModel[],
    requestStudent: Student_DataModel[]
  ) {
    const body = JSON.stringify({
      subjects: request,
      students: requestStudent
    });


    return this.http.post(this.APIUrl + '/PreExam_Student_Subject', body, this.headersOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).toPromise();
  }

  public async SaveRejectAtBTER(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveRejectAtBTER`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Save_Student_Optional_Subject(request: ITIExaminationOptionalSubjectRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(this.APIUrl + '/Save_Student_Optional_Subject', body, this.headersOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).toPromise();
  }
  public async GetStudentOptionalSubject_ByStudentID(StudentID: number, DepartmentID: number) {
    return await this.http.get(`${this.APIUrl}/GetStudentOptionalSubject_ByStudentID/${StudentID}/${DepartmentID}/`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveAdmittedStudentData(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveAdmittedStudentData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetAnnextureListPreExamStudent(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetAnnextureListPreExamStudent", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async SaveEligibleForEnrollment(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveEligibleForEnrollment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async UpdateStudentEligibility(request: StudentAttendenceModel)
  {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UpdateStudentEligibility`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async UpdateDropout(request: ITIExamination_UpdateEnrollmentNoModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/UpdateDropout`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentDropoutStudent(StudentID: number, StudentExamID:number) {
    return await this.http.get(`${this.APIUrl}/GetStudentDropoutStudent/${StudentID}/${StudentExamID}/`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ReturnToAdmitted(StudentID:number) {
    /*    const body = JSON.stringify(request);*/
    return this.http.post(`${this.APIUrl}/ReturnToAdmitted/${StudentID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

}
