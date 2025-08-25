import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ExaminerDashboardSearchModel } from '../../../Models/ExaminerCodeLoginModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
  selector: 'app-it-support-dashboard',
  standalone: false,
  templateUrl: './it-support-dashboard.component.html',
  styleUrl: './it-support-dashboard.component.css'
})
export class ITSupportDashboardComponent {
  public viewPlacementDashboardList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new StaffMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public StaffMasterList: any = [];
  public examinerDashboardSearchModelReq = new ExaminerDashboardSearchModel()
  public SecretaryJDDashboardList: any = []
  constructor(
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private examinerService: ExaminerService,
    private sweetAlert2: SweetAlert2) {

  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();

  }
  async GetAllData() {
    this.examinerDashboardSearchModelReq.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.examinerDashboardSearchModelReq.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.examinerDashboardSearchModelReq.RoleID = this.sSOLoginDataModel.RoleID;
    this.examinerDashboardSearchModelReq.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    try {


      this.loaderService.requestStarted();
      await this.examinerService.ITSupportDashboard(this.examinerDashboardSearchModelReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.viewPlacementDashboardList = data['Data'];
          console.log(this.viewPlacementDashboardList, 'ListData');
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
