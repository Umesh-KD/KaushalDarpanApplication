import { Component } from '@angular/core';
import { StudentDetailUpdateModel } from '../../Models/StudentDetailUpdateModel';
import { EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StudentdetailUpdateService } from '../../Services/StudentDetailUpdate/studentdetail-update.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../Common/appsetting.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-student-detail-update',
  templateUrl: './student-detail-update.component.html',
  styleUrls: ['./student-detail-update.component.css'],
  standalone: false
})

export class StudentDetailUpdateComponent {
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  UserID: number = 0
  RoleID: number = 0
  StudentDetailUpdateData: any = [];
  IsShowViewStudent: boolean = false;
  _EnumRole = EnumRole;
  sSOLoginDataModel = new SSOLoginDataModel();
  Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  EditStudentDataform!: FormGroup;
  SearchStudentDataFormGroup!: FormGroup;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  StudentProfileDetailsData: any = [];
  Student_QualificationDetailsData: any = [];
  request = new StudentDetailUpdateModel();
  file!: File;

  constructor(
    private studentdetailUpdateService: StudentdetailUpdateService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit() {


    this.SearchStudentDataFormGroup = this.formBuilder.group(
      {
        txtEnrollmentNo: [''],
        txtApplicationNo: ['']
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID
    //this.request.InstituteID = this.sSOLoginDataModel.InstituteID
    this.GetStudentDetailUpdate();

    this.EditStudentDataform = this.formBuilder.group({
      txtEnrollmentNo: [''],
      txtStudentName: ['', Validators.required],
      txtFatherName: ['', Validators.required],
      document: ['', Validators.required],
      txtRemark: ['', Validators.required],
      txtMobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Assuming a 10-digit mobile number
      txtEmail: ['', [Validators.required, Validators.email]]
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async EditStudentData(content: any, StudentID: number) {
    this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetByID(StudentID);
  }


  async GetByID(id: number) {
    var DepartmentID = this.sSOLoginDataModel.DepartmentID
    var Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    try {
      this.loaderService.requestStarted();
      await this.studentdetailUpdateService.GetByID(id, DepartmentID, Eng_NonEng)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");
          this.request = data['Data']
          this.request.ApplicationNo = data['Data']["ApplicationNo"];
          this.EditStudentDataform.patchValue(
            {
              txtEnrollmentNo: data['Data']["EnrollmentNo"],
              txtStudentName: data['Data']["StudentName"],
              txtFatherName: data['Data']["FatherName"],
              txtEmail: data['Data']["Email"],
              txtMobileNo: data['Data']["MobileNo"],
              txtRemark: data['Data']["Remark"],
              document: data['Data']["Document"]

            });
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
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

  async btn_SearchClick() {
    this.isSubmitted = true;
    if (this.SearchStudentDataFormGroup.invalid) {
      return
    }
    try {
      await this.GetStudentDetailUpdate();

    }
    catch (Ex) {
      console.log(Ex);
    }


  }

  CloseViewStudentDetails() {
    this.modalService.dismissAll();
    this.request = new StudentDetailUpdateModel()
  }

  async GetStudentDetailUpdate() {
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      await this.studentdetailUpdateService.GetStudentDetailUpdate(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          //
          if (data.State == EnumStatus.Success) {
            this.StudentDetailUpdateData = data['Data'];
            console.log(this.StudentDetailUpdateData, 'detailupdate')
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }

  async SaveData_EditStudentDetails() {
    this.isSubmitted = true;

    if (this.EditStudentDataform.invalid) {
      return
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.request.Remark = this.EditStudentDataform.value.txtRemark

    
    this.loaderService.requestStarted();
    try {
      await this.studentdetailUpdateService.UpdateStudentData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            await this.GetStudentDetailUpdate();
            await this.ResetControls();
            await this.CloseViewStudentDetails();
            await this.GetStudentDetailUpdate();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetControls() {
    this.GetStudentDetailUpdate();
  }
  async btn_Clear() {
    /* this.SearchStudentDataFormGroup.reset()*/
    this.request.ApplicationNo = '';
    this.request.EnrollmentNo = '';
    await this.GetStudentDetailUpdate();

  }

  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Document") {
                this.request.Dis_Document = data['Data'][0]["Dis_FileName"];
                this.request.Document = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonFunctionService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Document") {
            this.request.Dis_Document = '';
            this.request.Document = '';
          }
          //else if (Type == "Sign") {
          //  this.requestStudent.Dis_StudentSign = '';
          //  this.requestStudent.StudentSign = '';
          //}
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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
}
