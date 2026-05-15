import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, throwError } from 'rxjs';
import { StreamMasterDataModelsTesting } from '../../Models/StreamMasterDataModelsTesting';
import { AppsettingService } from '../../Common/appsetting.service';
import { CalendarEventModel, CalendarEventModelBter, CalendarEventModelITI, PostAttendanceTimeTable, RosterDisplayTimeTableDataModel } from '../../Models/StaffMasterDataModel';

@Injectable({
  providedIn: 'root'
})
export class AttendanceServiceService {
  readonly APIUrl = this.appsettingConfig.apiURL + "Student";
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

  public async SaveAttendanceTimeTable(request: any) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/SaveAttendanceTimeTable', request, this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetAttendanceTimeTable(model:any) {
    return await this.http.post(this.APIUrl + '/GetAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async PostAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/PostAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async RePostAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/RePostAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }



  public async GetStudentAttendance(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetStudentAttendanceWitMarkingStatus(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendanceWitMarkingStatus', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }




  public async GetStudentAttendanceReport(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendanceReport', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetStudentAttendancePercentReport(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendancePercentReport', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetStudentAttendanceSubjectWise(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendanceSubjectWise', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetStudentAttendance_ITI(model: any) {
    return await this.http.post(this.APIUrl + '/ITIGetStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetStudentAttendance_ITIReport(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendance_ITIReport', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetTeacherAttendence(model: any) {
    return await this.http.post(this.APIUrl + '/GetTeacherAttendence', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }



  public async GetStudentAttendance_PercentReport(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendance_PercentReport', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async saveAttendanceData(model: any) {
    return await this.http.post(this.APIUrl + '/AddStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SaveAttendanceDataWithStatus(model: any) {
    return await this.http.post(this.APIUrl + '/SaveAttendanceDataWithStatus', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async saveAttendanceRopsteData(model: any) {
    return await this.http.post(this.APIUrl + '/saveAttendanceRopsteData', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async saveITI_AttendanceData(model: any) {
    return await this.http.post(this.APIUrl + '/ITI_AddStudentAttendance', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async ITIGetAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/ITI_GetAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async ITIReAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/ITIReAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async PostAttendanceTimeTableList(model: PostAttendanceTimeTable[]) {
    return await this.http.post(this.APIUrl + '/PostAttendanceTimeTableList', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async SetCalendarEventModel(model: any[]) {
    debugger
    return await this.http.post(this.APIUrl + '/SetCalendarEventModel', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async SetCalendarEventModelITI(model: any[]) {
    debugger
    return await this.http.post(this.APIUrl + '/SetCalendarEventModelITI', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async UpdateCalendarEventModelITI(model: any[]) {
    debugger
    return await this.http.post(this.APIUrl + '/UpdateCalendarEventModelITI', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async getCalendarEventModel(model: CalendarEventModel) {
    return await this.http.post(this.APIUrl + '/getCalendarEventModel', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async getCalendarEventModelITI(model: CalendarEventModel) {
    return await this.http.post(this.APIUrl + '/getCalendarEventModelITI', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async getAssignCalendarEventModelITI(model: CalendarEventModelITI) {
    return await this.http.post(this.APIUrl + '/getAssignCalendarEventModelITI', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
  public async getAssignCalendarEventModelBter(model: CalendarEventModelBter) {
    return await this.http.post(this.APIUrl + '/getAssignCalendarEventModelBter', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetRosterDisplay_PDFTimeTable(model: RosterDisplayTimeTableDataModel) {
    return await this.http.post(`${this.APIUrl}/GetRosterDisplay_PDFTimeTable`, model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
  public async GetRosterDisplay_PDFTimeTableDownload(model: RosterDisplayTimeTableDataModel) {
    return await this.http.post(`${this.APIUrl}/GetRosterDisplay_PDFTimeTableDownload`, model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async DeleteAssignTeacherForSubject(model: any) {
    return await this.http.post(this.APIUrl + '/DeleteAssignTeacherForSubject', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetStudentAttendanceTLC(model: any) {
    return await this.http.post(this.APIUrl + '/GetStudentAttendanceTLC', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async SaveStudentAttendanceTLC(model: any) {
    return await this.http.post(this.APIUrl + '/SaveStudentAttendanceTLC', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetReAttendanceTimeTable(model: any) {
    return await this.http.post(this.APIUrl + '/GetReAttendanceTimeTable', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetAssignedLCStream(model: PostAttendanceTimeTable) {
    return await this.http.post(this.APIUrl + '/GetAssignedLCStream', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }
}
