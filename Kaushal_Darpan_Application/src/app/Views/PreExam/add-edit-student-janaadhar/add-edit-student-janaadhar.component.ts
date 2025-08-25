import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StudentsJanaadharService } from '../../../Services/StudentsJanaadhar/students-janaadhar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentsJanAadharSearchModel } from '../../../Models/StudentsJanAadharSearchModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentJanAadharDetailService } from '../../../Services/StudentJanAadharDetail/student-jan-aadhar-detail.service';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
    selector: 'app-add-edit-student-janaadhar',
    templateUrl: './add-edit-student-janaadhar.component.html',
    styleUrls: ['./add-edit-student-janaadhar.component.css'],
    standalone: false
})
export class AddEditStudentJanaadharComponent implements OnInit {
  public StudentId: number = 0;
  StudentJanaadharForm!: FormGroup;
  public StudentsJanaadharList: any ;
  public InstituteMasterList: any ;
  public DistrictMasterList: any ;
  public AdharMemberList: any ;
  public sSOLoginDataModel = new SSOLoginDataModel();
  constructor(private commonMasterService: CommonFunctionService,
    private studentsJanaadharService: StudentsJanaadharService,
    private studentJanAadharDetailService: StudentJanAadharDetailService,
    private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private routers: Router, private modalService: NgbModal) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async ngOnInit() {
    this.loadMasterData();
    this.StudentId = Number(this.activatedRoute.snapshot.paramMap.get('ExamMasterID')?.toString());
    this.StudentJanaadharForm = this.formBuilder.group({
      DropoutStatus: [{ value: '', disabled: true }],
      AadharNo: [{ value: '', disabled: true }],
      BranchName: [{ value: '', disabled: true }],
      DOB: [{ value: '', disabled: true }],
      District: [{ value: '', disabled: true }],
      EnrollmentNo: [{ value: '', disabled: true }],
      FatherAadharNo: [{ value: '', disabled: true }],
      FatherName: [{ value: '', disabled: true }],
      Gender: [{ value: '', disabled: true }],
      Institute: [{ value: '', disabled: true }],
      JanAadharNo: [{ value: '', disabled: true }],
      JanAadharStatus: [{ value: '', disabled: true }],
      MobileNo: [{ value: '', disabled: true }],
      MotherName: [{ value: '', disabled: true }],
      StudentName: [{ value: '', disabled: true }],
      JanAadharMemberId: [''],
    })
    await this.EditJanAadharStudent(this.StudentId);
    
  }

  loadMasterData(): void {
    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        this.InstituteMasterList = data['Data'];
      });
    this.commonMasterService.GetDistrictMaster()
      .then((data: any) => {
        this.DistrictMasterList = data['Data'];
      });
  }

  GotoStudentsJanaadhar(): void{
    this.routers.navigate(['/studentsjanaadhar']);
  }

  // edit janaadhar student
  async EditJanAadharStudent(studentID: number) {
    if (this.sSOLoginDataModel.DepartmentID != 0 && studentID != null) {
      let obj: StudentsJanAadharSearchModel = {
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          StudentID: studentID,
          EnrollmentNo: '',
          StudentName: '',
          Gender: '',
          MobileNo: '',
          JanAadharNo: '',
          JanAadharStatus: ''
      }
      try {
        this.loaderService.requestStarted();
        await this.studentsJanaadharService.GetStudentsJanAadharData(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            this.StudentsJanaadharList = data['Data'][0];
            this.getMemberListJanaadhar();
            this.StudentJanaadharForm.patchValue({
              DropoutStatus: this.StudentsJanaadharList.DropoutStatus,
              AadharNo: this.StudentsJanaadharList.AadharNo,
              BranchName: this.StudentsJanaadharList.BranchName,
              DOB: this.StudentsJanaadharList.DOB ? new Date(this.StudentsJanaadharList.DOB).toISOString().split('T')[0] : '', 
              District: this.StudentsJanaadharList.DistrictID,
              EnrollmentNo: this.StudentsJanaadharList.EnrollmentNo,
              FatherAadharNo: this.StudentsJanaadharList.FatherAadharNo,
              FatherName: this.StudentsJanaadharList.FatherName,
              Gender: this.StudentsJanaadharList.Gender,
              Institute: this.StudentsJanaadharList.InstituteID,
              JanAadharNo: this.StudentsJanaadharList.JanAadharNo,
              JanAadharStatus: this.StudentsJanaadharList.JanAadharStatus,
              MobileNo: this.StudentsJanaadharList.MobileNo,
              MotherName: this.StudentsJanaadharList.MotherName,
              StudentName: this.StudentsJanaadharList.StudentName,
              JanAadharMemberId: this.StudentsJanaadharList.JanAadharMemberId,
            })

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


  // edit janaadhar student
  async postStudentJanaadharForm() {
    if (this.sSOLoginDataModel.DepartmentID != 0 && this.StudentId != null && this.StudentJanaadharForm.value.JanAadharMemberId != null && this.StudentJanaadharForm.value.JanAadharMemberId != undefined) {
      let obj: any = {
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          RoleID: this.sSOLoginDataModel.RoleID,
          StudentID: this.StudentId,
          JanAadharMemberId: this.StudentJanaadharForm.value.JanAadharMemberId
      }
      try {
        this.loaderService.requestStarted();
        await this.studentsJanaadharService.postStudentJanaadharForm(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.toastr.success("Updated Janadhar Member Successfully.")
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.Message + " Please check Janadhar/ Adhar Number again")
            } else {
              this.toastr.error(data.ErrorMessage)
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

  // Get Member List Janaadhar
  async getMemberListJanaadhar() {
    try {
      if (this.StudentsJanaadharList && this.StudentsJanaadharList.JanAadharNo != null) {
        await this.studentJanAadharDetailService.JanAadhaarMembersList(this.StudentsJanaadharList.JanAadharNo)

          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.AdharMemberList = data.Data;
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.Message + " Please check Janadhar/ Adhar Number again")
            } else {
              this.toastr.error(data.ErrorMessage)
            }
          }, (error: any) => console.error(error)
          );
      }
     
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
