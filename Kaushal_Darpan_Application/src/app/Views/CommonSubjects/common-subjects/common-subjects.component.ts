import { Component, OnInit } from '@angular/core';
import { CommonSubjectMasterSearchModel } from '../../../Models/CommonSubjectMasterSearchModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSubjectService } from '../../../Services/CommonSubjects/common-subjects.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumStatus } from '../../../Common/GlobalConstants';


@Component({
    selector: 'app-common-subjects',
    templateUrl: './common-subjects.component.html',
    styleUrls: ['./common-subjects.component.css'],
    standalone: false
})
export class CommonSubjectsComponent implements OnInit {

  public SemestarMasterDDLList: any = [];
  public SubjectMasterDDLList: any = [];
  public CommonSubjectList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new CommonSubjectMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  constructor(private commonMasterService: CommonFunctionService, private commonSubjectService: CommonSubjectService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {

  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetSemestarMatserDDL();
    await this.GetAllData();

  }

  // get semestar ddl
  async GetSemestarMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SemestarMasterDDLList = data['Data'];
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

  async ddlSemester_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_SemesterIDWise(this.searchRequest.SemesterID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
          console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)
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

  // get all data
  async GetAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    try {
      this.loaderService.requestStarted();
      await this.commonSubjectService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CommonSubjectList = data['Data'];
          console.log("CommonSubjectList", this.CommonSubjectList)
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.CommonSubjectName = '';
    this.searchRequest.SemesterID = 0;
    this.searchRequest.SubjectID = 0;
    await this.GetAllData();
    this.SubjectMasterDDLList = [];
  }

  // delete by id
  async DeleteById(commonSubjectId: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.commonSubjectService.DeleteById(commonSubjectId, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  await this.GetAllData();
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
      });
  }
}
