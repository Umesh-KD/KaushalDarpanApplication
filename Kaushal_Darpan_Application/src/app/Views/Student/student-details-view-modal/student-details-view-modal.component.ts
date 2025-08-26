import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ViewStudentDetailsRequestModel } from '../../../Models/ViewStudentDetailsRequestModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { enumExamStudentStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-student-details-view-modal',
  standalone: false,
  templateUrl: './student-details-view-modal.component.html',
  styleUrl: './student-details-view-modal.component.css'
})
export class StudentDetailsViewModalComponent {
  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];
  public documentDetails: DocumentDetailsModel[] = [];

  request = new PreExamStudentDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public _enumExamStudentStatus = enumExamStudentStatus;

  private modalRef: any;
  @ViewChild('MyModel_ViewStudent') MyModel_ViewStudent: any;
  closeResult: string | undefined;

  @Input() StudentID!: any;
  @Input() StatusId!: any;
  @Output() onVerified = new EventEmitter<void>();

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private modalService: NgbModal,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async GetStudentProfileDetails(StudentID: number, StatusId: number) {
    try {
      this.loaderService.requestStarted();
      //model
      let model = new ViewStudentDetailsRequestModel()
      model.StudentID = StudentID;
      model.StudentFilterStatusId = StatusId;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      //
      await this.commonMasterService.ViewStudentDetails(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentProfileDetailsData = data['Data']['ViewStudentDetails'];
          this.Student_QualificationDetailsData = data['Data']['Student_QualificationDetails'];
          this.documentDetails = data['Data']['documentDetails'];
          // for admitted/new admitted
          if (this.StudentProfileDetailsData[0].status == null || this.StudentProfileDetailsData[0].status == "") {
            this.StudentProfileDetailsData[0].status = this.StudentProfileDetailsData[0].status1;
          }
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

  async OpenViewStudentDetailsPopup() {
    debugger
    await this.GetStudentProfileDetails(this.StudentID,this.StatusId);
    this.ViewPopup(this.MyModel_ViewStudent);
  }

  async ViewPopup(content: any) {
    debugger
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

  CloseViewStudentDetails() {
    if (this.modalRef) {
      this.modalRef.close(); 
    }
  }


}
