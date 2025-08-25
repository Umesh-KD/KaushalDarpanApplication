import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { StudentMarkedModel, StudentMasterModel, Student_DataModel } from '../../Models/StudentMasterModels';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonSubjectMasterModel } from '../../Models/CommonSubjectMasterModel';
import { CommonSubjectDetailsMasterModel } from '../../Models/CommonSubjectDetailsMasterModel';
@Injectable({
  providedIn: 'root'
})
export class PreExamStudentService {
  readonly APIUrl = this.appsettingConfig.apiURL + "PreExamStudent";
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
  public async GetPreExamStudent(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPreExamStudent", body, this.headersOptions)
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
  public async SaveData_PreExam_UpdateEnrollmentNo(request: PreExam_UpdateEnrollmentNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/PreExam_UpdateEnrollmentNo", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async PreExam_UpdateOptionalSubject(request: PreExam_UpdateEnrollmentNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/PreExam_UpdateOptionalSubject", body, this.headersOptions)
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

  public async Save_Student_Exam_Status(request: Student_DataModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(this.APIUrl + '/Save_Student_Exam_Status', body, this.headersOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).toPromise();
  }

  public async Save_Student_Exam_Status_Update(request: Student_DataModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(this.APIUrl + '/Save_Student_Exam_Status_Update', body, this.headersOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).toPromise();
  }

  public async SaveData(request: PreExam_UpdateEnrollmentNoModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/save-student-status", body, this.headersOptions)
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

  public async SaveAdmittedStudentData(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveAdmittedStudentData`, body, this.headersOptions)
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
}

