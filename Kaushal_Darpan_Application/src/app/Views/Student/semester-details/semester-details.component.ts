import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentService } from '../../../Services/Student/student.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-semester-details',
  templateUrl: './semester-details.component.html',
  styleUrls: ['./semester-details.component.css'],
  standalone: false
})
export class SemesterDetailsComponent implements OnInit
{
  
  public searchRequest = new StudentSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public StudentDetailsModelList: StudentDetailsModel[] = [];
  public StudentSubjectList: [] = [];
  public SemesterName: string = '';

  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;


  constructor(private loaderService: LoaderService, private studentService: StudentService, private modalService: NgbModal) { }
  async  ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }

  async GetAllData()
  {
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.roleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.action = '_StudentSemesterDetails';
      await this.studentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success)
          {
            this.StudentDetailsModelList = data['Data'];

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

  async openModal(content: any, item: StudentDetailsModel)
  {
    this.SemesterName = item.Semester;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.searchRequest.action = '_GetSemeterWiseSubject';
    this.searchRequest.studentId = item.StudentID;
    this.searchRequest.SemesterID = item.SemesterID;
    await this.GetStudentDeatilsByAction()
  }

  async GetStudentDeatilsByAction()
  {
    this.StudentSubjectList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentService.GetStudentDeatilsByAction(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentSubjectList = data['Data'];
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

  CloseModal() { this.modalService.dismissAll(); }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
