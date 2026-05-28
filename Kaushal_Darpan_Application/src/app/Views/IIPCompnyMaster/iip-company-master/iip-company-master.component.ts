import { Component, OnInit } from '@angular/core';
import { CompanyMasterSearchModel, ICompanyMasterDataModel } from '../../../Models/CompanyMasterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../../Services/CompanyMaster/company-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ActivatedRoute,Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-iip-company-master',
  standalone:false,
  templateUrl: './iip-company-master.component.html',
  styleUrl: './iip-company-master.component.css'
})
export class IipCompanyMasterComponent implements OnInit {

  public CompanyMasterList: ICompanyMasterDataModel[] = [];
    public Table_SearchText: string = "";
    public searchRequest = new CompanyMasterSearchModel();
    public sSOLoginDataModel = new SSOLoginDataModel();
    public ApprovedStatus: string = "0";
     State: any;
  Message: any;
  ErrorMessage: any;
  todayDate: string = '';
  _enumRole = EnumRole;
    public mouRequest: any = {
  ID: 0,
  CompanyId: 0,
  MoUStartDate: '',
  MoUValidTill: '',
  Remark: '',
  MoUDoc: '',
  DisMoUDoc:'',
  ActiveStatus: true,
  DeleteStatus: false,
  CreatedBy: 0,
  ModifyBy: 0,
  IPAddress: '',
  Action: 'Insert'
};

public showMouPopup: boolean = false;

selectedFile: any;
  
    constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
      private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute,
          private activatedRoute: ActivatedRoute,
    private appsettingConfig: AppsettingService) {
  
    }
  
    async ngOnInit() {

       var status = Number
       (
    this.activatedRoute.snapshot.queryParamMap.get('EventStatus')??0
  );

    
 switch (status) {

  case 1:
    this.searchRequest.Status = 'Pending';
    break;

  case 2:
    this.searchRequest.Status = 'Approved';
    break;

  case 3:
    this.searchRequest.Status = 'Rejected';
    break;

  default:
    this.searchRequest.Status = '';
    break;
}


      this.todayDate = new Date().toISOString().split('T')[0];
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      await this.GetAllData();
    }
  
  
    exportToExcel(): void {
      const unwantedColumns = [
        'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
        'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
      ];
      const filteredData = this.CompanyMasterList.map((item: any) => {
        const filteredItem: any = {};
        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem;
      });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'CompanyMasterListData.xlsx');
    }
  
    async GetAllData() {
      try {
        this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
          this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
          this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.loaderService.requestStarted();
        await this.companyMasterService.GetAllData(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CompanyMasterList = data.Data;
          console.log(this.CompanyMasterList)
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
      this.searchRequest.Status = '';
  
      await this.GetAllData();
    }
  
  
  
  
    async DeleteById(ID: number) {
      debugger
      this.Swal2.Confirmation("Do you want to delete?",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            try {
              //Show Loading
              this.loaderService.requestStarted();
  
              await this.companyMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  console.log(data);
  
                  if (data.State) {
                    this.toastr.success(data.Message)
                    await this.GetAllData();
                  }
                  else {
                    this.toastr.error(data.ErrorMessage)
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

//     openMouPopup(company: any) {

//   this.mouRequest = {
//     ID: 0,
//     CompanyId: company.ID,
//     MoUStartDate: '',
//     MoUValidTill: '',
//     Remark: '',
//     MoUDoc: '',
//     ActiveStatus: true,
//     DeleteStatus: false,
//     CreatedBy: this.sSOLoginDataModel.UserID,
//     ModifyBy: this.sSOLoginDataModel.UserID,
//     IPAddress: '',
//     Action: 'INSERT'
//   };

//   this.showMouPopup = true;
// }

async openMouPopup(company: any) {

  try {

    this.loaderService.requestStarted();

    debugger
    // Default blank model for insert
    this.mouRequest = {
      ID: 0,
      CompanyId: company.ID,
      MoUStartDate: '',
      MoUValidTill: '',
      Remark: '',
      MoUDoc: '',
      DisMoUDoc: '',
      ActiveStatus: true,
      DeleteStatus: false,
      CreatedBy: this.sSOLoginDataModel.UserID,
      ModifyBy: this.sSOLoginDataModel.UserID,
      IPAddress: '',
      Action: 'INSERT'
    };

    // EDIT CASE
    if (company.MouAdded == 1) {

      const request = {
        CompanyId: company.ID,
        Action: '',
        MoUDoc: '',
        Remark: '',
        IPAddress: ''
      };

      debugger
      await this.companyMasterService
        .GetCompanyMoUDetails(request)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success && data.Data != null) {

            const mouData = data.Data;

            this.mouRequest = {

              ID: mouData.ID,
              CompanyId: mouData.CompanyId,

              MoUStartDate: mouData.MoUStartDate
                ? mouData.MoUStartDate.split('T')[0]
                : '',

              MoUValidTill: mouData.MoUValidTill
                ? mouData.MoUValidTill.split('T')[0]
                : '',

              Remark: mouData.Remark,

              MoUDoc: mouData.MoUDoc,
              DisMoUDoc: mouData.DisMoUDoc || '',

              ActiveStatus: mouData.ActiveStatus,
              DeleteStatus: mouData.DeleteStatus,

              CreatedBy: mouData.CreatedBy,
              ModifyBy: this.sSOLoginDataModel.UserID,

              IPAddress: mouData.IPAddress,

              Action: 'UPDATE'
            };

          }
          else {

            this.toastr.error(data.ErrorMessage);

          }

        }, (error: any) => {

          console.error(error);

        });
    }

    // OPEN MODAL
    this.showMouPopup = true;

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

closeMouPopup() {
  this.showMouPopup = false;
}

   public file!: File;
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
           }
           else {
             this.toastr.error('Select Only jpeg/jpg/png file')
             return
           }
           this.loaderService.requestStarted();
   
           await this.commonMasterService.UploadDocument(this.file)
             .then((data: any) => {
               data = JSON.parse(JSON.stringify(data));
   
               if (data.State == EnumStatus.Success) {
                 if (Type == "Photo") {
                   this.mouRequest.MoUDoc = data['Data'][0]["FileName"];
                   this.mouRequest.DisMoUDoc = data['Data'][0]["Dis_FileName"];
                   console.log(this.mouRequest,'ListRequest')
                 }
                 event.target.value = null;
               }
               if (data.State == EnumStatus.Error) {
                 this.toastr.error(data.ErrorMessage)
               }
               else if (data.State == EnumStatus.Warning) {
                 this.toastr.warning(data.ErrorMessage)
               }
             });
         }
       }
       catch (Ex) {
         console.log(Ex);
       }
       finally {
         this.loaderService.requestEnded();
       }
     }
   

//     async saveMouDetails() {

//   try {

//     if (!this.mouRequest.MoUStartDate) {
//       this.toastr.error('Please select MOU Start Date');
//       return;
//     }

//     if (!this.mouRequest.Remark) {
//       this.toastr.error('Please enter Remark');
//       return;
//     }

//     this.loaderService.requestStarted();

//     await this.companyMasterService
//       .InsertCompanyMoUDetails(this.mouRequest)
//       .then((data: any) => {

//         data = JSON.parse(JSON.stringify(data));

//         if (data.State) {

//           this.toastr.success(data.Message);

//           this.showMouPopup = false;

//           this.GetAllData();

//         } else {

//           this.toastr.error(data.ErrorMessage);

//         }

//       }, (error: any) => {
//         console.error(error);
//       });

//   }
//   catch (ex) {
//     console.log(ex);
//   }
//   finally {

//     setTimeout(() => {
//       this.loaderService.requestEnded();
//     }, 200);

//   }
// }

async saveMouDetails() {

  try {

    // Validation
    if (!this.mouRequest.MoUStartDate) {

      this.toastr.error('Please select MOU Start Date');
      return;

    }

    if (!this.mouRequest.MoUValidTill) {

      this.toastr.error('Please select MOU Valid Till Date');
      return;

    }

     // Date Validation
    const startDate = new Date(this.mouRequest.MoUStartDate);
    const validTillDate = new Date(this.mouRequest.MoUValidTill);

    if (validTillDate <= startDate) {

      this.toastr.error('MOU Valid Till Date must be greater than MOU Start Date');
      return;

    }


    if (!this.mouRequest.Remark) {

      this.toastr.error('Please enter Remark');
      return;

    }

    this.loaderService.requestStarted();

    // Save Data
    await this.companyMasterService
      .InsertCompanyMoUDetails(this.mouRequest)
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));

        if (data.State == EnumStatus.Success) {

          this.toastr.success(data.Message);

          this.showMouPopup = false;

          this.GetAllData();

        }
        else {

          this.toastr.error(data.ErrorMessage);

        }

      }, (error: any) => {

        console.error(error);

      });

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

async SendForApprove(company: any) {

  try {

    this.Swal2.Confirmation(
      "Do you want to send for approval?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {

            this.loaderService.requestStarted();
debugger
            const request = {
              CompanyId: company.ID,
              Action: '',
              MoUDoc: '',
              Remark: '',
              IPAddress: ''
            };

            await this.companyMasterService
              .SendForApprove(request)
              .then(async (data: any) => {

                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {

                  this.toastr.success(data.Message);

                  await this.GetAllData();

                }
                else {

                  this.toastr.error(data.ErrorMessage);

                }

              }, (error: any) => {

                console.error(error);

              });

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
  catch (ex) {

    console.log(ex);

  }
}
}
