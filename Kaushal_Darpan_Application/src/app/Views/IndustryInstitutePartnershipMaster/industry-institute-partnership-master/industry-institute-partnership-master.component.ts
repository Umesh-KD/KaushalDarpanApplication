import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { IndustryInstitutePartnershipMasterSearchModel, IIndustryInstitutePartnershipMasterDataModel, IndustryTrainingMaster } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-industry-institute-partnership-master',
  standalone: false,
  templateUrl: './industry-institute-partnership-master.component.html',
  styleUrl: './industry-institute-partnership-master.component.css'
})
export class IndustryInstitutePartnershipMasterComponent {

  groupForm!: FormGroup;
  public IndustryInstitutePartnershipMasterList: IIndustryInstitutePartnershipMasterDataModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new IndustryInstitutePartnershipMasterSearchModel();
  public request = new IndustryTrainingMaster();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  modalReference: NgbModalRef | undefined;
  public EventTypelist: any[] = [];
  public todayDate: string = this.formatDate(new Date());
  public isSubmitted: boolean = false;
  SemesterMasterList: any = [];
  public ItiTradeList: any = [];
  public DDlTradesearchRequest = new ItiTradeSearchModel();
  public isLoading: boolean = false;
  public IndID: number = 0;
  constructor(private fb: FormBuilder, private commonMasterService: CommonFunctionService, private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, private appsettingConfig: AppsettingService, private loaderService: LoaderService, private Swal2: SweetAlert2, private modalService: NgbModal,) {

  }


  async ngOnInit() {

   

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
    await this.GetEventTypelist();
    await this.GetTradeListDDL();
    await this.commonMasterService.SemesterMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SemesterMasterList = data['Data'];
    }, (error: any) => console.error(error));

   

    const today = new Date();
    this.todayDate = this.formatDate(today);

    this.request.EventDate = this.formatDate(today);
    this.groupForm = this.fb.group({
      ddlEventTypeID: [0, [DropdownValidators]],
      ddlSemesterID: [0, [DropdownValidators]],
      ddlTradeID: [0, [DropdownValidators]],
      txtPurpose: ['', Validators.required],
      txtEventDate: ['', Validators.required]

    });
  }


 

  async GetEventTypelist() {
    this.EventTypelist = [
      { ID: 1, Name: 'Online Event' },
      { ID: 2, Name: 'Physical Event' },

    ];
  }

  async GetTradeListDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          //this.TradeDDLList = data['Data'];
          //console.log(this.TradeDDLList)
          const selectOption = { StreamID: 0, StreamName: '--Select--' };
          this.ItiTradeList = [selectOption, ...data['Data']];
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
  //async GetTradeListDDL() {
    
  //  try {

  //      this.DDlTradesearchRequest.CollegeID =9, 
  //      this.DDlTradesearchRequest.TradeLevel= 0,
  //      this.DDlTradesearchRequest.action= '_getDatabyCollege',
  //      this.DDlTradesearchRequest.IsPH= 0, 
  //      this.DDlTradesearchRequest.CourseTypeID= 0 
  //    this.loaderService.requestStarted();

  //    await this.commonMasterService.TradeListGetAllData(this.DDlTradesearchRequest).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.ItiTradeList = data.Data
  //    })
  //  } catch (error) {
  //    console.error(error)
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  onEventDateChange() {
    const fromDate = new Date(this.request.EventDate);
    
  }

  // Helper function to format date as YYYY-MM-DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.industryInstitutePartnershipMasterService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.IndustryInstitutePartnershipMasterList = data.Data;
        console.log(this.IndustryInstitutePartnershipMasterList)
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

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';

    await this.GetAllData();
  }

  async DeleteById(ID: number) {
    
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.industryInstitutePartnershipMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                console.log(data);

                if (this.State == EnumStatus.Success) 
                  {
                    this.toastr.warning(this.Message)
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


  async onSubmit(model: any, userSubmitData: any) {
    
    try {
     
     // this.request = { ...userSubmitData };
      this.request.EventTypeID = 0;
      this.request.SemesterID = 0;
      this.request.TradeID = 0;
      this.request.IndustryID ;
      this.request.Purpose = '';
      this.request.EventDate = '';

      this.IndID = userSubmitData.ID,
      console.log(this.request, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.request.EventDate = '';
    this.request.EventTypeID = 0;
    this.request.SemesterID = 0;
    this.request.Purpose = '';
    this.request.TradeID = 0;
    this.isSubmitted = false;
  }


  async updateReqStatus() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.IndustryID = this.IndID;



    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
 this.request.ModifyBy = 0;
 this.request.IPAddress = '::01';
  




    try {
     /* this.request.ModifyBy = this.sSOLoginDataModel.UserID;*/
      await this.industryInstitutePartnershipMasterService.SaveIndustryTrainingData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.GetAllData();
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
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
        this.isLoading = false;

      }, 200);
    }
  }

}
