import { Component } from '@angular/core';
import { NodalModel, SearchNodalModel } from '../../../Models/NodalModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NodalService } from '../../../Services/NodalOfficer/nodal-service';
import { SSOLoginService } from '../../../Services/SSOLogin/ssologin.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus } from '../../../Common/GlobalConstants';
declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
  selector: 'app-nodal-list',
  templateUrl: './nodal-list.component.html',
  styleUrls: ['./nodal-list.component.css'],
  standalone: false
})
export class NodalListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public NodalOfficersList: any = []
  public searchRequest = new SearchNodalModel();
  public Request = new NodalModel();
  public State: number = 0;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public NodalRequestFormGroup!: FormGroup;
  public UserID: number = 0;
  public SSOID: string = '';
  nodel: any[] = [];
  public NodalId: number = 0;
  //NodalOfficersList: NodalModel[] = [];


  constructor(
    private sSOLoginService: SSOLoginService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private nodalService: NodalService,
    private Swal2: SweetAlert2) {
  }


  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('CompanyID')?.toString());
    this.Request.ModifyBy = this.sSOLoginDataModel.UserID

    await this.GetAllData()
    if (this.NodalId > 0) {
      await this.GetByID(this.NodalId);
    }
  }

  async GetAllData() {
    
    try {
      this.loaderService.requestStarted();
      await this.nodalService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.NodalOfficersList = data.Data;
        console.log(this.NodalOfficersList)
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
    this.searchRequest.SSOID = '';
    this.searchRequest.MobileNo = '';
    this.searchRequest.Name = '';
    await this.GetAllData();
  }



  //async btnDelete_OnClick(NodalId: number) {
  //  
  //  this.Swal2.Confirmation("Are you sure you want to delete this ?",
  //    async (result: any) => {
  //      //confirmed
  //      if (result.isConfirmed) {
  //        try {
  //          //Show Loading
  //          this.loaderService.requestStarted();
  //          this.Request.NodalId = NodalId;
  //          this.Request.SSOID = this.NodalOfficersList.SSOID

  //          await this.nodalService.DeleteByID(this.Request)
  //            .then(async (data: any) => {
  //              data = JSON.parse(JSON.stringify(data));
  //              console.log(data);

  //              this.State = data['State'];
  //              this.Message = data['Message'];
  //              this.ErrorMessage = data['ErrorMessage'];

  //              if (this.State = EnumStatus.Success) {
  //                this.toastr.success(this.Message)
  //                //reload
  //                this.GetAllData()
  //              }
  //              else {
  //                this.toastr.error(this.ErrorMessage)
  //              }

  //            }, (error: any) => console.error(error)
  //            );
  //        }
  //        catch (ex) {
  //          console.log(ex);
  //        }
  //        finally {
  //          setTimeout(() => {
  //            this.loaderService.requestEnded();
  //          }, 200);
  //        }
  //      }
  //    });
  //}
  async btnDelete_OnClick(NodalId: number) {
    

    // Ensure NodalOfficersList has data
    if (!this.NodalOfficersList || this.NodalOfficersList.length === 0) {
      console.error("NodalOfficersList is empty");
      return;
    }

    // Find the officer from NodalOfficersList using NodalId
    const officer = this.NodalOfficersList.find((officer: any) => officer.NodalId === NodalId);

    if (!officer) {
      console.error("Officer with the specified NodalId not found");
      return;
    }

    this.Swal2.Confirmation("Are you sure you want to delete this ?", async (result: any) => {
      //confirmed
      if (result.isConfirmed) {
        try {
          // Show Loading
          this.loaderService.requestStarted();

          // Set Request object values
          this.Request.NodalId = NodalId;
          this.Request.SSOID = officer.SSOID;  // Set SSOID from the found officer
          console.log("Request:", this.Request);  // Debugging request object

          // Perform delete operation
          await this.nodalService.DeleteByID(this.Request)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (this.State === EnumStatus.Success) {
                this.toastr.success(this.Message);
                // Reload data
                this.GetAllData();
              } else {
                this.toastr.error(this.ErrorMessage);
              }

            }, (error: any) => console.error(error));

        } catch (ex) {
          console.log(ex);
        } finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    });
  }



  
  async onView(model: any, nodel: any) {
    
    try {
      await this.GetByID(nodel.NodalId); 
      //console.log(this.Request.NodalModellist);
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  closeModal() {
    this.modalReference?.close();
  }

  //excel export
  public async ExcelExport() {
    if (this.NodalOfficersList.length > 0) {
      tableToExcel("tbl_nodalOfficers", "NodalOfficers", "NodalOfficersCenter");
    }
  }
 
  async GetByID(id: number) {
    ;
    try {
      this.loaderService.requestStarted();
      await this.nodalService.GetByID(id)
        .then((data: any) => {
          console.log(data);
          data = JSON.parse(JSON.stringify(data));

          // Assuming data['Data'] is an array of records
          const records = data['Data'];

          // Clear existing list before pushing new data (optional, depending on your needs)
          this.Request.NodalModellist = [];

          // Loop through the array of records
          records.forEach((record: any) => {
            // Create a new object for each record and map it to the appropriate structure
            const nodalData = {
              NodalId: record["NodalId"],
              SSOID: record["SSOID"],
              Name: record["Name"],
              Email: record["Email"],
              MobileNo: record["MobileNo"],
              IsAdd_CollageFees: record["IsAdd_CollageFees"],
              IsEdit_Stu: record["IsEdit_Stu"],
              NodalModellist: this.Request.NodalModellist,
              DepartmentID: 0,
              ActiveStatus: false,
              DeleteStatus: false,
              ModifyBy: 0,
              CreatedBy: 0,
              Marked: false,
              UserID :0,
            };

            // Push each record into the nodalmodallist
            this.Request.NodalModellist.push(nodalData);

            //this.Request.NodalId = nodalData["NodalId"];
            //this.Request.SSOID = nodalData["SSOID"];
            //this.Request.Name = nodalData["Name"];
            //this.Request.Email = nodalData["Email"];
            //this.Request.MobileNo = nodalData["MobileNo"];
            //this.Request.IsAdd_CollageFees = nodalData["IsAdd_CollageFees"];
            //this.Request.IsEdit_Stu = nodalData["IsEdit_Stu"];
            //this.Request.CreatedBy = nodalData['CreatedBy']
            //console.log(this.Request.Name = nodalData["Name"]);

          });

          // Log the updated nodalmodallist to ensure it's populated correctly
          console.log(this.Request.NodalModellist);

          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => {
          console.error(error);
        });
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

  maskMobileNumber(mobileNo: string): string {
    if (!mobileNo) return '';  
    const lastFour = mobileNo.slice(-4); 
    return '******' + lastFour;  
  }

}


