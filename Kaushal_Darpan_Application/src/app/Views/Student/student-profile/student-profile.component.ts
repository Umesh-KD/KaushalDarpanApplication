import { Component, OnInit } from '@angular/core';
import { M_StudentMaster_QualificationDetailsModel, StudentMasterModel } from '../../../Models/StudentMasterModels';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./student-profile.component.css'],
    standalone: false
})
export class StudentProfileComponent implements OnInit {
  public requestfrm = new StudentMasterModel();
  requestStudent = new StudentMasterModel();
  RequestStudent = new M_StudentMaster_QualificationDetailsModel();

  ddlCasteCategoryListA: any;
  ddlCasteCategoryListB: any;
  sSOLoginDataModel = new SSOLoginDataModel();

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetPreExam_StudentMaster(this.sSOLoginDataModel.StudentID);
    this.GetCasteCategoryA();
    this.GetCasteCategoryB();
  }
  constructor(private loaderService: LoaderService, private commonFunctionService: CommonFunctionService) { }

  //get edit student
  async GetPreExam_StudentMaster(StudentID: number) {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    var EndTermID = this.sSOLoginDataModel.EndTermID
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.PreExam_StudentMaster(StudentID, 1, DepartmentID, Eng_NonEng,EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.requestStudent = data['Data'];
          console.log(this.requestStudent)
          this.requestStudent.StudentID = data['Data']['StudentID'];
          this.requestStudent.EnrollmentNo = data['Data']['EnrollmentNo'];
          this.requestStudent.AdmissionCategoryID = data['Data']['AdmissionCategoryID'];
          this.requestStudent.InstituteID = data['Data']['InstituteID'];
          this.requestStudent.StreamID = data['Data']['StreamID'];
          this.requestStudent.InstituteStreamID = data['Data']['InstituteStreamID'];
          this.requestStudent.StudentName = data['Data']['StudentName'];
          this.requestStudent.StudentNameHindi = data['Data']['StudentNameHindi'];
          this.requestStudent.FatherName = data['Data']['FatherName'];
          this.requestStudent.FatherNameHindi = data['Data']['FatherNameHindi'];
          this.requestStudent.MotherName = data['Data']['MotherName'];
          this.requestStudent.StudentExamStatus = data['Data']['StudentExamStatus'];
          this.requestStudent.MotherNameHindi = data['Data']['MotherNameHindi'];
          this.requestStudent.Gender = data['Data']['Gender'];
          this.requestStudent.DOB = data['Data']['DOB'];
          this.requestStudent.CategoryA_ID = data['Data']['CategoryA_ID'];
          this.requestStudent.CategoryB_ID = data['Data']['CategoryB_ID'];
          this.requestStudent.MobileNo = data['Data']['MobileNo'];
          this.requestStudent.TelephoneNo = data['Data']['TelephoneNo'];
          this.requestStudent.Email = data['Data']['Email'];
          this.requestStudent.Address1 = data['Data']['Address1'];
          this.requestStudent.AadharNo = data['Data']['AadharNo'];
          this.requestStudent.FatherAadharNo = data['Data']['FatherAadharNo'];
          this.requestStudent.JanAadharNo = data['Data']['JanAadharNo'];
          this.requestStudent.JanAadharMobileNo = data['Data']['JanAadharMobileNo'];
          this.requestStudent.JanAadharName = data['Data']['JanAadharName'];
          this.requestStudent.BankAccountNo = data['Data']['BankAccountNo'];
          this.requestStudent.IFSCCode = data['Data']['IFSCCode'];
          this.requestStudent.BankAccountName = data['Data']['BankAccountName'];
          this.requestStudent.BankName = data['Data']['BankName'];
          this.requestStudent.StudentPhoto = data['Data']['StudentPhoto'];
          this.requestStudent.StudentSign = data['Data']['StudentSign'];
          this.requestStudent.Remark = data['Data']['Remark'];
          this.requestStudent.TypeOfAdmissionID = data['Data']['TypeOfAdmissionID'];
          this.requestStudent.StudentStatusID = data['Data']['StudentStatusID'];
          this.requestStudent.SemesterID = data['Data']['SemesterID'];
          this.requestStudent.StudentTypeID = data['Data']['StudentTypeID'];
          this.requestStudent.BhamashahNo = data['Data']['BhamashahNo'];
          this.requestStudent.JanAadharMemberId = data['Data']['JanAadharMemberId'];
          this.requestStudent.JanAadharMemberId = data['Data']['JanAadharMemberId'];
          this.requestStudent.Papers = data['Data']['Papers'];

          this.requestStudent.Dis_StudentPhoto = data['Data']['Dis_StudentPhoto'];
          this.requestStudent.Dis_StudentSign = data['Data']['Dis_StudentSign'];

          this.requestStudent.Dis_DOB = (new Date(data['Data']['Dis_DOB']).toISOString().split('T').shift()?.toString()) ?? "";


          //this.requestStudent.Dis_DOB = "1899-12-31";
          this.requestStudent.QualificationDetails = data['Data']['QualificationDetails'];
          this.requestStudent.commonSubjectDetails = data['Data']['Subjects'];
          this.requestStudent.Status_old = data['Data']['Status_old'];


        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetCasteCategoryA() {
    this.ddlCasteCategoryListA = [];
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.ddlCasteCategoryListA = data['Data'];

            console.log("GetCasteCategoryA" + this.ddlCasteCategoryListA)
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetCasteCategoryB() {
    this.ddlCasteCategoryListB = [];
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.CasteCategoryB()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.ddlCasteCategoryListB = data['Data'];
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
