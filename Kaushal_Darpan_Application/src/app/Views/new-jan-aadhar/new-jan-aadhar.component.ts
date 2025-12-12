import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { JanAadharDetailService } from '../../Services/JanAadharDetailService/JanAadharDetail.service';
import { JanAadharDetailModel, NewJanAadharDetailsEntity } from '../../Models/NewJanAadharAPIModel';
import { LoaderService } from '../../Services/Loader/loader.service';

@Component({
    selector: 'new-jan-aadhar',
    templateUrl: './new-jan-aadhar.component.html',
    styleUrls: ['./new-jan-aadhar.component.css'],
    standalone: false
})
export class JanAadharDetailComponent implements OnInit {

  public  request = new JanAadharDetailModel();
  public JanAdharMemberList:NewJanAadharDetailsEntity[]=[];
  public isFirstStep:boolean =true;
  public IsShow:boolean=false;
  public showMemberDetail:boolean=false;

    constructor(
      // private commonMasterService: CommonFunctionService, 
      // private ItiDataMasterService: ItiDataMasterService,
      private toastr: ToastrService, 
      private loaderService: LoaderService, 
      // private Swal2: SweetAlert2, 
      // private Router: Router, 
      // private router: ActivatedRoute,
      // private modalService: NgbModal,
      // private formBuilder: FormBuilder,
      // private documentDetailsService: DocumentDetailsService, 
      // public appsettingConfig: AppsettingService, 
      private NewJanAadharDetailService:JanAadharDetailService,
    ) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  public StudentList: any = [];
 
    btnFistStep(event: Event) {
      debugger
    event.preventDefault();
    const janAadhar = this.request.JAN_AADHAR?.trim();
    if (!janAadhar || janAadhar.length < 10 || janAadhar.length > 12 || !/^\d+$/.test(janAadhar)) {
      this.toastr.error('Please enter a valid Jan Aadhar Number ( 10 digits)');
      return;
    }
    this.GetJanaadhaarMembersList();

  }

    async GetJanaadhaarMembersList() {


    if (this.request.JAN_AADHAR.length < 10 || this.request.JAN_AADHAR.length > 12) {
      this.toastr.error("Invalid Janadhar Details");
      return;
    }

    try {
      await this.NewJanAadharDetailService.JanAadhaarMembersList(this.request.JAN_AADHAR)
        .then((data: any) => {


          const apiRes = data?.Data?.response;

          if (apiRes?.status === true && apiRes?.responseCode === "JAN_200") {

            this.JanAdharMemberList = apiRes.data;
            this.isFirstStep = false;
            this.IsShow = true;

            console.log(this.JanAdharMemberList);

          } else {
            this.toastr.warning(
              apiRes?.message ||
              data?.Message ||
              "Please check Jan Aadhaar again"
            );
          }
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



  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }




}
