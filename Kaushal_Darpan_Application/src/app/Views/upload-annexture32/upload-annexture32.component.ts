import { Component } from '@angular/core';
import { HrMasterDataModel } from '../../Models/HrMasterDataModel';
import { ScholarshipModel } from '../../Models/ScholarshipDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { HrMasterService } from '../../Services/HrMaster/hr-master.service';
import { ScholarshipService } from '../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { StreamDDL_InstituteWiseModel } from '../../Models/CommonMasterDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../Services/Report/report.service';
import { Annexture32DataModel } from '../../Models/BTER/UploadAnnextureDataModel';
@Component({
  selector: 'app-upload-annexture32',
  standalone: false,
  templateUrl: './upload-annexture32.component.html',
  styleUrl: './upload-annexture32.component.css'
})
export class UploadAnnexture32Component {
  public ScholarshipID: number = 0;
  public SemesterMasterList: any[] = [];
  public BranchList: any[] = [];
  public CategoryList: any[] = [];


  public request = new Annexture32DataModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ScholarshipFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public streamsearchmodel = new StreamDDL_InstituteWiseModel()
  public InstituteID: number = 0
  

  constructor(private commonMasterService: CommonFunctionService, private ScholarshipService: ReportService, private toastr: ToastrService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal

    , private http: HttpClient
  ) {

  }

  async ngOnInit() {


    // form group
 

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ScholarshipID = Number(this.activatedRoute.snapshot.queryParamMap.get('ID')?.toString());
    this.request.InstituteID = this.ScholarshipID
    if (this.request.InstituteID > 0) {
      await this.getExaminerData()
    }
    //this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    //await this.GetSemesterMatserDDL();
    //await this.GetCategoryMatserDDL()
    //await this.GetStreamMatserDDL()


  
  }



  async getExaminerData() {
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

    try {
      await this.ScholarshipService.GetUploadAnnexture32(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.request = data['Data'][0];
      
      })
    } catch (error) {
      console.error(error);
    }
  }
  DownloadAdmitCard(item: any): void {


    var fileUrl = '';

    fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ITIReportsFolder + GlobalConstants.ITIAdmitCardFolder + "/" + item.AdmitCard;;

    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

  // get detail by id
  async GetById() {
    try {

      var body = {
        InstituteID: this.sSOLoginDataModel.InstituteID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID
      }
      this.loaderService.requestStarted();
      this.ScholarshipService.GetsampleAnnexture32(body)
        .subscribe({
          next: (blob: Blob) => {

            const now = new Date();
            const dateTime =
              now.getFullYear().toString() +
              ('0' + (now.getMonth() + 1)).slice(-2) +
              ('0' + now.getDate()).slice(-2) + '_' +
              ('0' + now.getHours()).slice(-2) +
              ('0' + now.getMinutes()).slice(-2);

            const fileName = `Annexure32_${dateTime}.pdf`;

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();

            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Failed to download report');
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

  // get detail by id
  async SaveData() {

    try {
      this.isSubmitted = true;
      if (this.request.FileName == '') {
        this.toastr.warning("Please Upload Document")
        return
      }

      this.isLoading = true;
      this.loaderService.requestStarted();

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.request.UserID = this.sSOLoginDataModel.UserID;


      //save
      await this.ScholarshipService.UploadAnnexture32(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/UploadAnnexture32List']);
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

  // reset
  ResetControls() {
    this.request.DisFileName = ''
    this.request.FileName=''
    //this.request.StreamID = 0
    //this.request.SemesterID = 0
    //this.request.Amount = null
    //this.request.TotalStudent = null
    //this.request.Category = 0
    //this.multiSelect.toggleSelectAll();
  }

 
  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();
         
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.DisFileName = data['Data'][0]["Dis_FileName"];
                this.request.FileName  = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async Back() {
    this.routers.navigate(['/UploadAnnexture32List'])
  }
}
