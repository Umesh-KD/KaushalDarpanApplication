import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Common/common';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { HostelInstituteMappingModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-dte-hostel-institute-mapping-list',
  standalone: false,
  templateUrl: './dte-hostel-institute-mapping-list.component.html',
  styleUrl: './dte-hostel-institute-mapping-list.component.css'
})
export class DteHostelInstituteMappingListComponent {
  public Table_SearchText: string = "";
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public HostelInstituteMappingList: any = [];
  HostelInstituteMappingRequest = new HostelInstituteMappingModel()

  public IsShowAddButton: boolean = true;


  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private studentRequestService: StudentRequestService,

  ) { }

  redirectToMapping(mappingId: number) {
    this.router.navigate(['/Hostel-Institute-Mapping'], {
      queryParams: { id: mappingId }
    });
  }

  editMapping(mappingId: number) {
    this.router.navigate(['/Hostel-Institute-Mapping'], {
      queryParams: { id: mappingId }
    });
  }
  async ngOnInit() {


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetAllHostelInstituteMappingList();


  }




  async GetAllHostelInstituteMappingList() {
    try {
      this.loaderService.requestStarted();

      await this._HostelManagmentService.GetAllHostelInstituteMappingList(this.HostelInstituteMappingRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelInstituteMappingList = data['Data'];

          if (this.HostelInstituteMappingList && this.HostelInstituteMappingList?.length > 0) {
            this.IsShowAddButton = false;
          }

          console.log(this.HostelInstituteMappingList, "GetAllHostelInstituteMappingList")
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

  async unmapHostel(mappingId: number) {

    this.Swal2.Confirmation("Are you sure you want to unmap this hostel?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {
            console.log("Clicked OK, ID:", mappingId);

            this.loaderService.requestStarted();

            const res: any = await this._HostelManagmentService.UnmapHostelInstitute(mappingId);

            console.log("API Response:", res);

            if (res && (res.State === 1 || res.state === 1)) {
              this.toastr.success(res.Message || "Unmapped successfully");
              await this.GetAllHostelInstituteMappingList();
            } else {
              this.toastr.error(res?.ErrorMessage || "Unmap failed");
            }

          } catch (error) {
            console.error("Error:", error);
            this.toastr.error("Something went wrong");
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }

        }

      });

  }
}
