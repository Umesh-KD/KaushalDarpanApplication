import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItiMeritService } from '../../../Services/ITI/ItiMerit/iti-merit.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { GenerateMeritSearchModel } from '../../../Models/ITI/GenerateMeritDataModel';

@Component({
  selector: 'app-generate-merit',
  //imports: [],
  templateUrl: './generate-merit.component.html',
  styleUrl: './generate-merit.component.css',
  standalone: false
})
export class GenerateMeritComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ITIStudentsList: any = []
  public QualificationList: any = []
  public CategoryList: any = []
  public State: number = 0;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public searchReq = new GenerateMeritSearchModel()


constructor(
  private sSOLoginService: SSOLoginService,
  private toastr: ToastrService,
  private loaderService: LoaderService,
  private formBuilder: FormBuilder,
  private router: ActivatedRoute,
  private routers: Router,
  private _fb: FormBuilder,
  private modalService: NgbModal,
  private itiMeritService: ItiMeritService,
  private commonMasterService: CommonFunctionService,
  private Swal2: SweetAlert2) {
}

async ngOnInit() {

  this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  //this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('CompanyID')?.toString());
  //this.Request.ModifyBy = this.sSOLoginDataModel.UserID
  await this.GetAllITIStudents()
/*  await this.GetQualificationDDL()*/
  await this.GetCategaryCastDDL()
  }


  async GetAllITIStudents() {

    try {
      this.loaderService.requestStarted();
      console.log("searc hREq", this.searchReq)
      await this.itiMeritService.GetAllITIStudents(this.searchReq).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ITIStudentsList = data.Data;
        console.log(this.ITIStudentsList)
      }, (error: any) => console.error(error))
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

  async ClearSearchData() {
    this.searchReq.CategoryID = 0;
    this.searchReq.Class = '';
    await this.GetAllITIStudents();
  }


  //async GetQualificationDDL() {

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetQualificationDDL('EduDDLFor')
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.QualificationList = data['Data'];
  //        console.log("EduDDLFor", this.QualificationList);
  //      }, (error: any) => console.error(error)
  //      );

  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async GetCategaryCastDDL() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryList = data['Data'];
          console.log("CategoryList", this.CategoryList)
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

