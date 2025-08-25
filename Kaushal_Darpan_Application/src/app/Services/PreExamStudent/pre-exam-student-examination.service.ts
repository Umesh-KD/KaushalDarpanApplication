import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingService } from '../../Common/appsetting.service';
import { catchError, throwError } from 'rxjs';
import { StudentMarkedModel, StudentMasterModel, Student_DataModel } from '../../Models/StudentMasterModels';
import { AnnexureDataModel, OptionalSubjectRequestModel, PreExamStudentDataModel, PreExam_UpdateEnrollmentNoModel } from '../../Models/PreExamStudentDataModel';
import { CommonSubjectDetailsMasterModel } from '../../Models/CommonSubjectDetailsMasterModel';
import { ViewStudentDetailsRequestModel } from '../../Models/ViewStudentDetailsRequestModel';

@Injectable({
  providedIn: 'root'
})
export class PreExamStudentExaminationService {
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

  public async GetEnrollmentCancelStudent(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetEnrollmentCancelStudent", body, this.headersOptions)
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







  public async GetStudentSubject_ByID(StudentID: number, DepartmentID: number = 0) {
    const headers = { 'content-type': 'application/json' }
    return await this.http.get(this.APIUrl + '/GetStudentSubject_ByID/' + StudentID + '/' + DepartmentID, this.headersOptions)
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
  public async SaveDropout(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveDropout`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async Save_Student_Optional_Subject(request: OptionalSubjectRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(this.APIUrl + '/Save_Student_Optional_Subject', body, this.headersOptions)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      ).toPromise();
  }


  public async GetStudentupdateEnrollData(StudentID: number, statusId: number, DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermID: number = 0, StudentExamID: number = 0) {

    return await this.http.get(`${this.APIUrl}/GetStudentupdateEnrollData/${StudentID}/${statusId}/${DepartmentID}/${Eng_NonEng}/${EndTermID}/${StudentExamID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async PreExam_StudentMaster(StudentID: number, statusId: number, DepartmentID: number = 0, Eng_NonEng: number = 0, EndTermID: number = 0, StudentExamID: number = 0) {

    return await this.http.get(`${this.APIUrl}/PreExam_StudentMaster/${StudentID}/${statusId}/${DepartmentID}/${Eng_NonEng}/${EndTermID}/${StudentExamID}`, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ViewStudentDetails(model: ViewStudentDetailsRequestModel) {
    let body = JSON.stringify(model);
    return await this.http.post(`${this.APIUrl}/ViewStudentDetails`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRejectBTERExcelData(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetRejectBTERExcelData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetMainAnnexure(request: AnnexureDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetMainAnnexure", body, { ...this.headersOptions, responseType: 'blob' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetSpecialAnnexure(request: AnnexureDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetSpecialAnnexure", body, { ...this.headersOptions, responseType: 'blob' })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async SaveRevokeDropout(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveRevokeDropout`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async SaveDetained(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveDetained`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async SaveRevokeDetained(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/SaveRevokeDetained`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPreExamStudentForVerify(request: PreExamStudentDataModel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/GetPreExamStudentForVerify", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async VerifyByExaminationIncharge(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/VerifyByExaminationIncharge`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async VerifyStudent_Registrar(request: StudentMarkedModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/VerifyStudent_Registrar`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
}
