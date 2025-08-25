import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AdminDashboardDataService } from '../../../Services/AdminDashboard/admin-dashboard-data.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CopyCheckerDashboardService } from '../../../Services/CopyCheckerDashboard/copy-checker-dashboard.service';
import { CopyCheckerRequestModel, ExaminerDashboardModel } from '../../../Models/CopyCheckerRequestModel';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { ExaminerCodeLoginModel } from '../../../Models/ExaminerCodeLoginModel';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';

@Component({
  selector: 'app-iti-centersuperintendent-dashboard',
  standalone: false,
  templateUrl: './iti-centersuperintendent-dashboard.component.html',
  styleUrl: './iti-centersuperintendent-dashboard.component.css'
})
export class ItiCentersuperintendentDashboardComponent {
  public viewPlacementDashboardList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _EnumRole = EnumRole;

  public State: number = 0;
  public SuccessMessage: string = '';
  public ErrorMessage: string = '';
  public ViewExaminerDashboardData: any = [] = [];
  public Table_SearchText: string = "";

  public copyCheckerRequest = new CopyCheckerRequestModel();
  public searchRequest = new ExaminerDashboardModel();

  constructor(private collegeDashDataService: ITICenterAllocationService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //load

      await this.GetCopyCheckerDashData();
    
  }

  async GetCopyCheckerDashData() {
    try {

      //session
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      //call
      this.loaderService.requestStarted();
      await this.collegeDashDataService.GetCenterSuperDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ViewExaminerDashboardData = data['Data'];
          console.log(this.ViewExaminerDashboardData, "DashBoo");
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

  async gotoTheoryMarks() {
    this.routers.navigate(['/TheoryMarks']);
  }
  }

