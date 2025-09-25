import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ViewStudentDetailsRequestModel } from '../../../Models/ViewStudentDetailsRequestModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { enumExamStudentStatus, EnumFileUpload } from '../../../Common/GlobalConstants';
import { PreExamStudentExaminationService } from '../../../Services/PreExamStudent/pre-exam-student-examination.service';

@Component({
  selector: 'app-student-exam-details-view-modal',
  standalone: false,
  templateUrl: './student-exam-details-view-modal.component.html',
  styleUrl: './student-exam-details-view-modal.component.css'
})
export class StudentExamDetailsViewModalComponent {
  public StudentProfileDetailsData: any = [];
  public Student_QualificationDetailsData: any = [];
  public documentDetails: DocumentDetailsModel[] = [];

  request = new PreExamStudentDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public _enumExamStudentStatus = enumExamStudentStatus;

  private modalRef: any;
  @ViewChild('MyModel_ViewStudentExam') MyModel_ViewStudentExam: any;
  closeResult: string | undefined;

  @Input() StudentID!: number;
  @Input() StatusId!: number;
  @Input() StudentExamID!: number;
  @Output() onVerified = new EventEmitter<void>();
  public IsYearly: boolean = false;

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    public appsettingConfig: AppsettingService,
    private modalService: NgbModal,
    private preExamStudentExaminationService: PreExamStudentExaminationService,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async GetStudentExamDetails(StudentID: number, StudentExamID: number) {
    try {
      this.loaderService.requestStarted();
      //model
      let model = new ViewStudentDetailsRequestModel()
      model.StudentID = StudentID;
      model.StudentFilterStatusId = this.request.StudentFilterStatusId;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      model.StudentExamID = StudentExamID;
      model.FileNameWithDynamicPath = EnumFileUpload.FileNameWithDynamicPath;
      //
      await this.preExamStudentExaminationService.ViewStudentDetails(model)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentProfileDetailsData = data['Data']['ViewStudentDetails'];
          this.Student_QualificationDetailsData = data['Data']['Student_QualificationDetails'];
          this.documentDetails = data['Data']['documentDetails'];
          // for admitted/new admitted
          if (this.StudentProfileDetailsData[0].status == null || this.StudentProfileDetailsData[0].status == "") {
            this.StudentProfileDetailsData[0].status = this.StudentProfileDetailsData[0].status1;
          }
          this.IsYearly = data['Data']['ViewStudentDetails'][0]['IsYearly'];
          //this.setStudentFilesForOldBterview()
          console.log(data['Data']['ViewStudentDetails'][0]['IsYearly'], "yearly")
          console.log(this.StudentProfileDetailsData, "view student")
          console.log(data)

        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async OpenViewStudentExamDetailsPopup() {
    //debugger
    await this.GetStudentExamDetails(this.StudentID,this.StudentExamID);
    await this.ViewPopup(this.MyModel_ViewStudentExam);
  }

  async ViewPopup(content: any) {
    //debugger
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
