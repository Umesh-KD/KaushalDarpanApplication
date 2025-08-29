import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppsettingService } from '../../Common/appsetting.service';
import { GenerateAdmitCardModel, GenerateAdmitCardSearchModel, GetCollegeInformationReport, GetEWSReport, GetUFMStudentReport, GetSessionalFailStudentReport, GetRMIFailStudentReport, GetTheoryFailStudentReport, GetRevaluationStudentDetailReport, GetStudentExaminerDetailReport } from '../../Models/GenerateAdmitCardDataModel';
import { PrincipalIssueCertificateModel } from '../../Models/PrincipalIssueCertificateModel';
import { AttendanceRpt13BDataModel, AttendanceRpt23DataModel, ReportBasedModel } from '../../Models/ReportBasedDataModel';
import { DataPagingListModel } from '../../Models/DataPagingListModel';
import { DownloadnRollNoModel } from '../../Models/GenerateRollDataModels';
import { ItiApplicationSearchmodel } from '../../Models/ItiApplicationPreviewDataModel';
import { BterSearchmodel } from '../../Models/ApplicationFormDataModel';
import { DownloadMarksheetSearchModel } from '../../Models/DownloadMarksheetDataModel';
import { BlankReportModel } from '../../Models/ExamMasterDataModel';
import { OptionalFormatReportSearchModel } from '../../Models/BTER/OptionalFormatReportdataModel';
import { NonElectiveFormFillingReportSearchModel } from '../../Models/BTER/NonElectiveFormFillingReportDataModel';
import { DownloadDispatchReceivedSearchModel } from '../../Models/DispatchFormDataModel';
import { OnlineMarkingSearchModel, StudentMarksheetSearchModel } from '../../Models/OnlineMarkingReportDataModel';
import { RenumerationExaminerPDFModel, RenumerationExaminerRequestModel } from '../../Models/RenumerationExaminerModel';
import { ITI_AppointExaminerDetailsModel } from '../../Models/ITI/ITI_ExaminerDashboard';
import {  VacantSeatRequestModel, ReportingStatusRequestModel, StudentDataAgeBetween15And29RequestModel, AllotmentReportCollegeRequestModel, AllotmentReportCollegeByAdminRequestModel, StudentItiSearchmodel, SearchCenterSuperintendentAttendance } from '../../Models/TheoryMarksDataModels';
import {ITI_DispatchAdmin_ByExaminer_RptSearchModel, ITIAddmissionReportSearchModel, ITIStateTradeCertificateSearchModel, TheoryMarksSearchModel, FinalAdmissionListRequestModel,
  ZoneDistrictSeatUtilizationByGenderRequestModel, ZoneDistrictSeatUtilizationRequestModel, ITIAddmissionWomenReportSearchModel, DirectAdmissionReportRequestModel, IMCAllotmentReportRequestModel, InternalSlidingReportRequestModel, SwappingReportRequestModel
} from '../../Models/TheoryMarksDataModels';
import { DTEApplicationDashboardModel, StudentCenteredActivitesSearchModel } from '../../Models/StudentCenteredActivitesModel';
import { ITIDetailListReportModel, ITISearchModel } from '../../Models/ITI-SearchDataModel';
import { ITITheorySearchModel } from '../../Models/ITI/ItiInvigilatorDataModel';
import { CenterStudentSearchModel } from '../../Models/ITITheoryMarksDataModel';
import { CampusPostMasterModel, CampusPostQRDetail } from '../../Models/CampusPostDataModel';
import { BterCertificateReportDataModel } from '../../Models/BTER/BterCertificateReportDataModel';
import { MarksheetLetterSearchModel } from '../../Models/MarksheetLetterDataModel';
import { RelievingLetterSearchModel } from '../../Models/ITI/UserRequestModel';
import { CenterAllocationSearchModel } from '../../Models/CenterAllocationDataModels';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  readonly APIUrl = this.appsettingConfig.apiURL + "Report";
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

  public async GetTeacherWiseReportsData() {
    return await this.http.get(this.APIUrl + "/GetTeacherWiseReportsData/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetSubjectWiseReportsData() {
    return await this.http.get(this.APIUrl + "/GetSubjectWiseReportsData/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetAllDataRpt(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetAllDataRpt`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentFeeReceipt(ApplicationNo: any) {
    return await this.http.get(this.APIUrl + "/GetStudentFeeReceipt/" + ApplicationNo, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DownloadChallan(ApplicationID: number) {
    return await this.http.get(this.APIUrl + "/GetStudentApplicationChallanReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadITIChallan(ApplicationID: number) {
    return await this.http.get(this.APIUrl + "/GetITIStudentApplicationChallanReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadAllotmentLetter(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetStudentAllotmentReceipt/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadReportingLetter(ApplicationID: any) {
    return await this.http.get(this.APIUrl + "/GetStudentReportingCertificate/" + ApplicationID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentApplicationFeeReceipt(ApplicationNo: any) {
    return await this.http.get(this.APIUrl + "/GetStudentApplicationFeeReceipt/" + ApplicationNo, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentAllotmentFeeReceipt(ApplicationNo: any) {
    return await this.http.get(this.APIUrl + "/GetStudentAllotmentFeeReceipt/" + ApplicationNo, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITIStudentApplicationFeeReceipt(TransactionID: number) {
    return await this.http.get(this.APIUrl + "/GetITIStudentApplicationFeeReceipt/" + TransactionID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentFeeReceipt(TransactionID: number) {
    return await this.http.get(this.APIUrl + "/GetITIStudentFeeReceipt/" + TransactionID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegesWiseReportsData() {
    return await this.http.get(this.APIUrl + "/GetCollegesWiseReports/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetGroupCenterMappingReportsData(data: any) {
    return await this.http.post(this.APIUrl + "/GetGroupCenterMappingReports/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBterStatisticsReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetBterStatisticsReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterDailyReportsData(data: any) {
    return await this.http.post(this.APIUrl + "/GetCenterDailyReports/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCenterDailyReportData(data: any) {
    return await this.http.post(this.APIUrl + "/GetCenterDailyReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ExaminationsReportsMenuWise(data: any) {
    return await this.http.post(this.APIUrl + "/examinations-reports-menu-wise/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentEnrollmentDetails(data: any) {
    return await this.http.post(this.APIUrl + "/download-student-enrollment-details/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DateWiseAttendanceReport(data: any) {
    return await this.http.post(this.APIUrl + "/date-wise-attendance-report/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentChangeEnrollmentDetails(data: any) {
    return await this.http.post(this.APIUrl + "/download-student-change-enrollment-details/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadOptionalFormatReport(data: any) {
    return await this.http.post(this.APIUrl + "/optional-format-report/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStaticsReportProvideByExaminer(data: any) {
    return await this.http.post(this.APIUrl + "/GetStaticsReportProvideByExaminer/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetOnlineReportProvideByExaminer(request: OnlineMarkingSearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetOnlineReportProvideByExaminer`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITISearchRepot(request: ITISearchModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetITISearchRepot`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerReportAndMarksTracking(data: any) {
    return await this.http.post(this.APIUrl + "/GetExaminerReportAndMarksTracking/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerReportAndMarksTrackingStudent(data: any) {
    return await this.http.post(this.APIUrl + "/GetExaminerReportAndMarksTrackingStudent/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ExaminerReportAndPresentTrackingStudent(data: any) {
    return await this.http.post(this.APIUrl + "/GetExaminerReportAndPresentTrackingStudent/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminerReportOfPresentAndAbsentDownload(data: any) {
    return await this.http.post(this.APIUrl + "/GetExaminerReportOfPresentAndAbsentDownload/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDownloadCenterDailyReports(data: any) {
    return await this.http.post(this.APIUrl + "/GetDownloadCenterDailyReports/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetCollegesWiseExaminationReportsData() {
    return await this.http.get(this.APIUrl + "/GetCollegesWiseExaminationReports/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetPrincipleDashboardReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetPrincipleDashboardReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //public async GetExaminationForm(DepartmentID: number, Eng_NonEng: number)
  //{
  //  return await this.http.get(this.APIUrl + "/GetExaminationForm/" + DepartmentID +'/'+ Eng_NonEng, this.headersOptions)
  //    .pipe(
  //      catchError(this.handleErrorObservable)
  //    ).toPromise();
  //}

  public async GetExaminationForm(request: ReportBasedModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetExaminationForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIExaminationForm(request: ReportBasedModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetITIExaminationForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BlankReport(request: BlankReportModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetBlankReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCollegeNodalReportsData(searchRequest: any) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(this.APIUrl + "/GetCollegeNodalReportsData", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentAdmitCard(request: GenerateAdmitCardSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentAdmitCard`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPrincipalIssueCertificate(request: PrincipalIssueCertificateModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetPrincipalIssueCertificate`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentEnrolledForm(request: ReportBasedModel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetStudentEnrolledForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentAdmitCardBulk(request: DataPagingListModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentAdmitCardBulk`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentAdmitCardBulk(request: DataPagingListModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetITIStudentAdmitCardBulk`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentRollNumber(request: DownloadnRollNoModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/DownloadStudentRollNumber`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadMarksheet(request: DownloadMarksheetSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentMarksheet`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async DownloadMarksheetBulk(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentMarksheetBulk`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadITIStudentRollNumber(request: DownloadnRollNoModel[]) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/DownloadITIStudentRollNumber`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIApplicationFormPreview(request: ItiApplicationSearchmodel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetITIApplicationFormPreview`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIApplicationForm(request: ItiApplicationSearchmodel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetITIApplicationForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationFormPreview(request: BterSearchmodel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetApplicationFormPreview`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApplicationFormPreview1(request: BterSearchmodel) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/GetApplicationFormPreview1`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetExaminersDetails(StaffID: number, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetExaminerDetails/" + StaffID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentEnrollmentReports(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentEnrollmentReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetIitStudentExamReports(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetIitStudentExamReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetItiStudentEnrollmentReports(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetItiStudentEnrollmentReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCustomizeStudentDetails(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetStudentCustomizeList`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentCustomizetReportsColumns() {
    return await this.http.post(`${this.APIUrl}/GetStudentCustomizetReportsColumns`, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetGender() {

    return await this.http.get(this.APIUrl + '/GetGender/', this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBlock() {
    return await this.http.get(this.APIUrl + '/GetBlock/', this.headersOptions).
      pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCourseType(DepartmentID: number = 0) {
    return await this.http.get(this.APIUrl + '/GetCourseType/' + DepartmentID, this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetInstitute() {
    return await this.http.get(this.APIUrl + '/GetInstitute/', this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();

  }

  public async GetEndTerm() {
    return await this.http.get(this.APIUrl + '/GetEndTerm/', this.headersOptions).pipe(catchError(this.handleErrorObservable)).toPromise();
  }

  public async GetAllotmentReceipt(AllotmentId: any) {
    return await this.http.get(this.APIUrl + "/GetAllotmentReceipt/" + AllotmentId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadHostelAffidavit(request: DownloadMarksheetSearchModel) {
    const body = JSON.stringify(request);
    return await this.http.post(`${this.APIUrl}/GetStudentHostelallotment`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetPaperCountCustomizeReportColumnsAndList(searchRequest: any) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/PaperCountCustomizeReportColumnsAndList`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async GetPaperCountCustomizeReportList(searchRequest: any) {
    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/PaperCountCustomizeReportList`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCenterWiseSubjectCountReportColumnsAndList(searchRequest: any) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetCenterWiseSubjectCountReportColumnsAndList`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async DownloadTimeTable(tablerequest: ReportBasedModel) {
    const body = JSON.stringify(tablerequest)
    return this.http.post(`${this.APIUrl}/DownloadTimeTable`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ItiDownloadTimeTable(tablerequest: ReportBasedModel) {
    const body = JSON.stringify(tablerequest)
    return this.http.post(`${this.APIUrl}/ItiDownloadTimeTable`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetOptionalFormatReportData(tablerequest: OptionalFormatReportSearchModel) {
    const body = JSON.stringify(tablerequest)
    return this.http.post(`${this.APIUrl}/GetOptionalFormatReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetNonElectiveFormFillingReportData(tablerequest: NonElectiveFormFillingReportSearchModel) {
    const body = JSON.stringify(tablerequest)
    return this.http.post(`${this.APIUrl}/GetNonElectiveFormFillingReportData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetFlyingSquadDutyOrder(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetFlyingSquadDutyOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetAllFlyingSquadDutyOrder(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetAllFlyingSquadDutyOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetFlyingSquadOrderReports(model: any) {
    return await this.http.post(this.APIUrl + '/GetFlyingSquadOrderReports', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }


  public async GetFlyingSquadReports(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetFlyingSquadTeamReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetITIFlyingSquadDutyOrder(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetITIFlyingSquadDutyOrder`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIFlyingSquadOrderReports(model: any) {
    return await this.http.post(this.APIUrl + '/GetITIFlyingSquadOrderReports', model, this.headersOptions).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }

  public async GetITIFlyingSquadReports(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetITIFlyingSquadReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIFlyingSquadTeamReports(request: any) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetITIFlyingSquadTeamReports`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDispatchGroupDetails(ID: number, EndTermID: number, CourseTypeID: number) {
    return await this.http.get(this.APIUrl + "/GetDispatchGroupDetails/" + ID + '/' + EndTermID + '/' + CourseTypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async DownloadDispatchGroupCertificate(ID: number, StaffID: number, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/DownloadDispatchGroupCertificate/" + ID + '/' + StaffID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AttendanceReport13B(request: AttendanceRpt13BDataModel) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/AttendanceReport13B`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Report33(request: AttendanceRpt13BDataModel) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/Report33`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DailyReport_BhandarForm1(request: AttendanceRpt13BDataModel) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/DailyReport_BhandarForm1`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDispatchPrincipalGroupCodeDetails(ID: number, DepartmentID: number) {

    return await this.http.get(this.APIUrl + "/GetDispatchPrincipalGroupCodeDetails/" + ID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetDispatchSuperintendentRptReport(ID: number, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetDispatchSuperintendentRptReport1/" + ID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }



  public async GetDownloadDispatchReceived(request: DownloadDispatchReceivedSearchModel, saveValue: number = 0) {

    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetDownloadDispatchReceived', request, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCenterWiseSubjectCountReportNew(searchRequest: any) {
    const body = JSON.stringify(searchRequest);

    return await this.http.post(`${this.APIUrl}/GetCenterWiseSubjectCountReportNew`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable)
      ).toPromise();

  }

  public async GetRport33Data(request: AttendanceRpt13BDataModel) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/GetRport33Data`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DailyReportBhandarForm(request: AttendanceRpt13BDataModel) {
    const body = JSON.stringify(request);

    return this.http.post(`${this.APIUrl}/DailyReportBhandarForm`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GenerateAndViewPdf(model: RenumerationExaminerRequestModel): Promise<any> {
    return this.http.post(`${this.APIUrl}/GenerateAndViewPdf`, model, {
      ...this.headersOptions,
      observe: 'response',
      responseType: 'blob' as 'json' // Tell Angular to treat it as binary
    }).pipe(
      catchError(this.handleErrorObservable)
    ).toPromise();
  }



  public async SavePDFSubmitAndForwardToJD(model: RenumerationExaminerRequestModel) {
    return await this.http.post(`${this.APIUrl}/SavePDFSubmitAndForwardToJD`, model, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITICollegeProfile(CollegeId: number) {
    return await this.http.get(this.APIUrl + "/GetITICollegeProfile/" + CollegeId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ScaReportAdmin(searchRequest: StudentCenteredActivitesSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/ScaReportAdmin`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetCenterSuperintendentStudentReport(searchRequest: DTEApplicationDashboardModel) {

    const body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetCenterSuperintendentStudentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async StatisticsInformationReportPdf(data: any) {
    return await this.http.post(this.APIUrl + "/StatisticsInformationReportPdf/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async TheorymarksReportPdf(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/TheorymarksReportPdf`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async TheorymarksReportPdf_BTER(searchRequest: TheoryMarksSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/TheorymarksReportPdf_BTER`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async Report23(request: AttendanceRpt23DataModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/Report23`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITIDispatchSuperintendentRptReport1(ID: number, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/GetITIDispatchSuperintendentRptReport1/" + ID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetCollegePaymentFeeReceipt(TransactionId: any) {
    return await this.http.get(this.APIUrl + "/GetCollegePaymentFeeReceipt/" + TransactionId, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITI_Dispatch_ShowbundleByExaminerToAdminData(searchRequest: ITI_DispatchAdmin_ByExaminer_RptSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITI_Dispatch_ShowbundleByExaminerToAdminData`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async ITIStateTradeCertificateReport(request: ITIStateTradeCertificateSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ITIStateTradeCertificateReport', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudent_Marksheet(searchRequest: StudentMarksheetSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIStudent_Marksheet`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async StateTradeCertificateDetails(request: ITIStateTradeCertificateSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/StateTradeCertificateDetails', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITIMarksheetConsolidated(request: ITIStateTradeCertificateSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ITIMarksheetConsolidated', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetITIStudent_MarksheetList(searchRequest: StudentMarksheetSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIStudent_MarksheetList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudent_PassList(searchRequest: StudentMarksheetSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIStudent_PassList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetITIStudent_PassDataList(searchRequest: StudentMarksheetSearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/GetITIStudent_PassDataList`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async PracticalExamReport(searchRequest: BlankReportModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/PracticalExamReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PracticalExamMarkingReport(searchRequest: BlankReportModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/PracticalExamMarkingReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PracticalExamAttendenceReport(searchRequest: BlankReportModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/PracticalExamAttendenceReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadTheoryStudentITI(searchRequest: ITITheorySearchModel) {
    var body = JSON.stringify(searchRequest);
    return await this.http.post(`${this.APIUrl}/DownloadTheoryStudentITI`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async ITITradeWiseResult(request: ITIStateTradeCertificateSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/ITITradeWiseResult', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITITradeWiseResultDataList(request: ITIStateTradeCertificateSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITITradeWiseResultDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getZoneFinalAdmissionList(request: ZoneDistrictSeatUtilizationRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetZoneDistrictSeatUtilization`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentAdmitCardBulk_CollegeWise(request: GenerateAdmitCardSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetITIStudentAdmitCardBulk_CollegeWise`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadITIStudentRollNumberBulk_CollegeWise(request: DownloadnRollNoModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/DownloadITIStudentRollNumber_CollageWise`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIAddmissionStatisticsDataList(request: ITIAddmissionReportSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITIAddmissionStatisticsDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITISeatUtilizationStatusDataList(request: ITIAddmissionReportSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITISeatUtilizationStatusDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async getZoneFinalAdmissionByGenderList(request: ZoneDistrictSeatUtilizationByGenderRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetZoneDistrictSeatUtilization_ByGender`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIAdmissionsInWomenWingDataList(request: ITIAddmissionWomenReportSearchModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITIAdmissionsInWomenWingDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentSeatAllotmentDataList(request: ITIAddmissionWomenReportSearchModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITIStudentSeatAllotmentDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  //Central Supridented
  public async GetCentarlSupridententDistrictReportDataListReport(request: CenterAllocationSearchModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    debugger
    return await this.http.post(this.APIUrl + '/GetCentarlSupridententDistrictReportDataListReport', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetITIStudentSeatWithdrawDataList(request: ITIAddmissionWomenReportSearchModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITIStudentSeatWithdrawDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async CenterWiseTradeStudentCount(request: CenterStudentSearchModel) {
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/CenterWiseTradeStudentCount', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
    }

    public async GetITITradeWiseAdmissionStatusDataList(request: ITIAddmissionWomenReportSearchModel) {
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify(request);
        return await this.http.post(this.APIUrl + '/GetITITradeWiseAdmissionStatusDataList', body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async GetITIPlaningDetailsDataList(request: ITIAddmissionWomenReportSearchModel) {
        const headers = { 'content-type': 'application/json' }
        const body = JSON.stringify(request);
        return await this.http.post(this.APIUrl + '/GetITIPlaningDetailsDataList', body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }

  public async GetITICategoryWiseSeatUtilizationDataList(request: ITIAddmissionReportSearchModel) {

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/GetITICategoryWiseSeatUtilizationDataList', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async showQRCode(request: CampusPostQRDetail) {
    const body = JSON.stringify(request)
    return this.http.post(`${this.APIUrl}/showQRCode`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async getVacantSeatList(request: VacantSeatRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetVacantSeatReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async getReportingStatusList(request: ReportingStatusRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetAllottedAndReportedCountByITI`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetStudentDataAgeBetween15And29(request: StudentDataAgeBetween15And29RequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentDataAgeBetween15And29`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async AllotmentReportCollege(request: AllotmentReportCollegeRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetAllotmentReportCollege`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async AllotmentReportCollegeForAdmin(request: AllotmentReportCollegeByAdminRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetAllotmentReportCollegeforAdmin`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentjanaadharDetailReport(request: StudentItiSearchmodel) {
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + "/Get_ITIStudentjanaadharDetailReport/", body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
    public async GetBterCertificateReport(data: any) {
        return await this.http.post(this.APIUrl + "/GetBterCertificateReport/", data, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }
  public async ResultStatisticsBridgeCourse(data: any) {
    return await this.http.post(this.APIUrl + "/DownloadResultStatisticsBridgeCourseReport/", data, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }
  public async ResultStatisticsReport(data: any) {
    return await this.http.post(this.APIUrl + "/DownloadResultStatisticsReport/", data, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }
  public async ResultStatisticsBridgeCourseStreamWise(data: any) {
    return await this.http.post(this.APIUrl + "/ResultStatisticsBridgeCourseStreamWiseReport/", data, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
  }

  public async PassoutStudentReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetPassoutStudentReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBterCertificateLetter(data: any) {
    return await this.http.post(this.APIUrl + "/GetBterCertificateLetter/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async GetBterDiplomaCertificate(data: any) {
    return await this.http.post(this.APIUrl + "/GetBterDiplomaCertificate/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBterDiplomaDateForDigiLockerReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetBterDiplomaDateForDigiLockerReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DirectAdmissionReport(request: DirectAdmissionReportRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetDirectAdmissionReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async IMCAllotmentReport(request: IMCAllotmentReportRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetIMCAllotmentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  // 🟢 Get Exam Result Type
  public async GetExamResultType(): Promise<any> {
    const request = this.http.get(`${this.APIUrl}/GetExamResultType`, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(request);
  }

  // 🟢 Download Single Certificate Report
  public async BterCertificateReportDownload(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/BterCertificateReportDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }
  public async BterDuplicateCertificateDownload(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/BterDuplicateCertificateDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }

  //DownloadDiplomaBulk

  public async BterDiplomaBulkReportDownload(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/BterDiplomaBulkReportDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }


  //Appeared-Passed-Statistics

  public async AppearedPassedStatisticsReportDownload(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/AppearedPassedStatisticsReportDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }

  //Appeared-Passed-InstituteWise

  public async AppearedPassedInstituteWiseDownload(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/AppearedPassedInstituteWiseDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }

  // 🟢 Download Bulk Certificate Report
  public async BterCertificateBulkReportDownload(requestArray: any): Promise<any> {
    const body = JSON.stringify(requestArray);
    const api = this.http.post(`${this.APIUrl}/BterCertificateBulkReportDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }
  public async BterCertificatePrePrintedBulkReportDownload(requestArray: any): Promise<any> {
    const body = JSON.stringify(requestArray);
    const api = this.http.post(`${this.APIUrl}/BterCertificatePrePrintedBulkReportDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }


  public async GetInstitutejanaadharDetailReport() {
    return await this.http.post(this.APIUrl + "/Get_ITIInstitutejanaadharDetailReport/", this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetDropOutStudentListby_instituteID(InstituteID : Number) {
    return await this.http.get(this.APIUrl + "/GetDropOutStudentListby_instituteID/" + InstituteID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetInternalSlidingReport(request: InternalSlidingReportRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetInternalSlidingForAdminReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetSwappingReport(request: SwappingReportRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetSwappingForAdminReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetEstablishManagementStaffReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetEstablishManagementStaffReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadStudentRollNumber_InsituteWise(data: DownloadnRollNoModel) {
    return await this.http.post(this.APIUrl + "/DownloadStudentRollNumber_InsituteWise/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetStudentAdmitCardBulk_InstituteWise(request: GenerateAdmitCardSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentAdmitCardBulk_InstituteWise`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BterBridgeCoruseReportDownload1(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/GetBterBridgeCourseReport`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }
  public async GetBterMassCopingReport(data: any) {
    debugger
    return await this.http.post(this.APIUrl + "/GetMassCoppingReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetInstituteStudentReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetInstituteStudentReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetBterBranchWiseStatisticalReport(request: any): Promise<any> {
    debugger
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/GetBterBranchWiseStatisticalReport`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
    }



    public async GetCollegesInformationReportsData(request: GetCollegeInformationReport) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/GetCollegeInformationReport`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }


    public async GetEWSReportsData(request: GetEWSReport) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/GetEWSReport`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }


    public async GetUFMStudentReport(request: GetUFMStudentReport) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/GetUFMStudentReport`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }


    public async GetSessionalFailStudentReport(request: GetSessionalFailStudentReport) {
      debugger
      const body = JSON.stringify(request);
      return this.http.post(`${this.APIUrl}/GetSessionalFailStudentReport`, body, this.headersOptions)
          .pipe(
              catchError(this.handleErrorObservable)
          ).toPromise();
      }

    // changess
    public async BterBridgeCoruseReportDownload(data: any) {
      debugger
        return await this.http.post(this.APIUrl + "/GetBterBridgeCourseReport/", data, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
      }

  public async GetBterMassCopingReport_new(data: any) {
    debugger
      return await this.http.post(this.APIUrl + "/GetMassCoppingReport/", data, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
    }

    public async DownloadMarksheetLetter(searchRequest: MarksheetLetterSearchModel) {
      var body = JSON.stringify(searchRequest);
      return await this.http.post(`${this.APIUrl}/MarksheetLetterDownload`, body, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }
    public async BterBridgeCoruseReportDownload2(request: any): Promise<any> {
      const body = JSON.stringify(request);
      const api = this.http.post(`${this.APIUrl}/GetBterBridgeCourseReport`, body, this.headersOptions)
        .pipe(catchError(this.handleErrorObservable));
      return await lastValueFrom(api);
  }

  public async GetBterBranchWiseStatisticalReport_new(request: any) {
    debugger
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/GetBterBranchWiseStatisticalReport`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }


  public async GetRMIFailStudentReport(request: GetRMIFailStudentReport) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetRMIFailStudentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetRevalDispatchGroupDetails(ID: number, EndTermID: number, CourseTypeID: number) {
    return await this.http.get(this.APIUrl + "/GetRevalDispatchGroupDetails/" + ID + '/' + EndTermID + '/' + CourseTypeID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async DownloadRevalDispatchGroupCertificate(ID: number, StaffID: number, DepartmentID: number) {
    return await this.http.get(this.APIUrl + "/DownloadRevalDispatchGroupCertificate/" + ID + '/' + StaffID + '/' + DepartmentID, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetTheoryFailStudentReport(request: GetTheoryFailStudentReport) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetTheoryFailStudentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async ITIAllotmentReport(request: IMCAllotmentReportRequestModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetITIAllotmentReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async BterRelievingLetter(request: RelievingLetterSearchModel) {
    debugger
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(request);
    return await this.http.post(this.APIUrl + '/RelievingLetterReport', body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }


  public async GetRevaluationStudentDetailReport(request: GetRevaluationStudentDetailReport) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetRevaluationStudentDetailReport`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetFresherApprenticeship(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/ApprenticeshipFresherReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPassoutApprenticeship(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/ApprenticeshipPassoutReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetApprenticeship(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/ApprenticeshipReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetWorkshopProgress(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/WorkshopProgressReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  
  public async GetPmnamMela(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/MelaReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async GetPmnam(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/PmnamMelaReport", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

  public async PmnamMelaReportnodelOfficer(obj: any) {

    var body = JSON.stringify(obj);
    console.log(body);
    const headers = { 'content-type': 'application/json' }
    return await this.http.post(this.APIUrl + "/PmnamMelaReportnodelOfficer", body, { 'headers': headers })
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }

    public async GetCenterSuperintendentAttendanceReport(request: SearchCenterSuperintendentAttendance) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/GetCenterSuperintendentAttendanceReport`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async GetStudentExaminerDetailReport(request: GetStudentExaminerDetailReport) {
        const body = JSON.stringify(request);
        return this.http.post(`${this.APIUrl}/GetStudentExaminerDetailReport`, body, this.headersOptions)
            .pipe(
                catchError(this.handleErrorObservable)
            ).toPromise();
    }

    public async GetITIEstablishManagementStaffReport(data: any) {
      return await this.http.post(this.APIUrl + "/GetITIEstablishManagementStaffReport/", data, this.headersOptions)
        .pipe(
          catchError(this.handleErrorObservable)
        ).toPromise();
    }

  public async GetBterDuplicateCertificateReport(data: any) {
    return await this.http.post(this.APIUrl + "/GetBterDuplicateCertificateReport/", data, this.headersOptions)
        .pipe(
            catchError(this.handleErrorObservable)
        ).toPromise();
  }

  public async DownloadDuplicateMarksheet(request: DownloadMarksheetSearchModel) {
    const body = JSON.stringify(request);
    return this.http.post(`${this.APIUrl}/GetStudentDuplicateMarksheet`, body, this.headersOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      ).toPromise();
  }
  public async BterDuplicateProvisionalCertificateDownload(request: any): Promise<any> {
    const body = JSON.stringify(request);
    const api = this.http.post(`${this.APIUrl}/BterDuplicateProvisionalCertificateDownload`, body, this.headersOptions)
      .pipe(catchError(this.handleErrorObservable));
    return await lastValueFrom(api);
  }
}


