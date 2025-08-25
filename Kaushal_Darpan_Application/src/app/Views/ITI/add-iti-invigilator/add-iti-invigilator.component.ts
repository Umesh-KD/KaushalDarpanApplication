import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { AppointExaminerService } from '../../../Services/AppointExaminer/AppointExaminer.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { AppointmentExaminerDataModel } from '../../../Models/AppointExaminerDataModel';
import { ItiInvigilatorDatAModel, ItiInvigilatorSearchModel } from '../../../Models/ITI/ItiInvigilatorDataModel';
import { ITIInvigilatorService } from '../../../Services/ITI/ITIInvigilator/itiinvigilator.service';


@Component({
  selector: 'app-add-iti-invigilator',
  standalone: false,
  templateUrl: './add-iti-invigilator.component.html',
  styleUrl: './add-iti-invigilator.component.css'
})
export class AddItiInvigilatorComponent {
  public AppointExaminerFromGroup!: FormGroup;
  @ViewChild('modal_ViewApplication') modal_ViewApplication: any;
  

  @Output() callParentFunction = new EventEmitter<void>();

public TimeTableID:number=0
  public isFormSubmitted: boolean = false;
  closeResult: string | undefined;
  public isLoading: boolean = false;
  public request = new ItiInvigilatorDatAModel();
  public searchrequest = new ItiInvigilatorSearchModel();
  public State: number = 0;
  private modalRef: any;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  assignedInstitutes: any = [];
  public StaffMasterList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public SubjectMasterDDL: any = []
  public SemesterMasterDDL: any = []
  public CourseMasterDDL: any = []
  public ExaminerSsoidDDL: any = []
  public AppointExamierList: any = []
  public isSubmitted:boolean=false
/*  public searchRequest = new AppointExaminerSearchModel();*/
  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Appointexamierservice: ITIInvigilatorService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {

    this.AppointExaminerFromGroup = this.formBuilder.group({

      ddlSSOID: ['', [DropdownValidators]],
      RollNoFrom: ['', [Validators.required]],
      RollNoTo: ['', [Validators.required]],


    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.request.UserID = this.sSOLoginDataModel.UserID
    
    /*    await this.GetAppointExaminerList()*/
    await this.GetStaffTypeDDL()
   // await this.GetInvigilatorList()

  }

  get _AppointExaminerFromGroup() { return this.AppointExaminerFromGroup.controls; }

  //async getMasterData() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetSubjectMasterDDL(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.SubjectMasterDDL = data.Data;
  //    }, error => console.error(error))

  //    await this.commonMasterService.SemesterMaster().then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.SemesterMasterDDL = data.Data;
  //    }, error => console.error(error))

  //    await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.ExaminerSsoidDDL = data.Data;
  //    }, error => console.error(error))

  //    await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));

  //      this.CourseMasterDDL = data.Data;
  //    })
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async SaveData() {

    try {
      this.isSubmitted = true;
      if (this.AppointExaminerFromGroup.invalid) {
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID

      //save
      await this.Appointexamierservice.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)

            this.GetInvigilatorList();
            this.ResetControls();

            // call parent function
            this.callParentFunction.emit();
          }
          else {
            this.toastr.error(this.ErrorMessage)
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
  async GetInvigilatorList() {
    this.AppointExamierList=[]
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchrequest.TimeTableID = this.TimeTableID
    this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchrequest.Action ='getinvigilator'
    try {
      this.loaderService.requestStarted();
      await this.Appointexamierservice.GetInvigilatorList(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AppointExamierList = data['Data'];
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


  async ResetControls() {
    this.isSubmitted = false
    this.AppointExaminerFromGroup.reset()
/*    this.request = new AppointmentExaminerDataModel()*/
  }

  async btnEdit_OnClick(ID: number) {
    this.isSubmitted = false;
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchrequest.TimeTableID = this.TimeTableID
    this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchrequest.InvigilatorID = ID
    this.searchrequest.Action='GetByid'
    try {
      this.loaderService.requestStarted();
      await this.Appointexamierservice.GetInvigilatorList(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'][0]
          this.request.InvigilatorID = data['Data'][0]['InvigilatorID']

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async btnDelete_OnClick(ID: number) {
    this.isSubmitted = false;
    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.searchrequest.TimeTableID = this.TimeTableID
    this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchrequest.InvigilatorID = ID
    this.searchrequest.Action = 'DeleteById'
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.Appointexamierservice.GetInvigilatorList(this.searchrequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  this.callParentFunction.emit();
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
          /*      this.GetAppointExaminerList()*/

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
      });
  }

  async GetStaffTypeDDL() {
    try {

      let obj = {
        InstituteID: this.sSOLoginDataModel.InstituteID,
        DepartmentID: EnumDepartment.ITI,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng:2


      }
      await this.commonMasterService.GetITIStaffInstituteWise(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.assignedInstitutes = data.Data;
      })  

    } catch (error) {
      console.error(error);
    }
  }

  async OpenViewApplicationPopup() {
    this.request.TimeTableID = this.TimeTableID
    this.GetStaffTypeDDL()
    this.GetInvigilatorList()
    this.ViewPopup(this.modal_ViewApplication);
  }

  async ViewPopup(content: any) {
    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  CloseOTPModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }



  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }

}
