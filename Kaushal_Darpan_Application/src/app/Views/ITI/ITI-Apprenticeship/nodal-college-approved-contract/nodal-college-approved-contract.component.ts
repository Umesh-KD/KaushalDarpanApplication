import { Component,NgModule } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumRole, EnumStatus, MONTH_LIST } from '../../../../Common/GlobalConstants';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { UploadBTERFileModel, UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
@Component({
  selector: 'app-nodal-college-approved-contract',
  standalone: false,
  templateUrl: './nodal-college-approved-contract.component.html',
  styleUrl: './nodal-college-approved-contract.component.css'
})
 
export class NodalCollegeApprovedContractComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request : any = {};

  CollegeApprovedContractForm!: FormGroup; 
  public Divisionlist: any = [];
  public Districtlist: any = [];
  public Institutelist: any = [];
  public DivisionData: any = [];
  InstitutelistNew: Institute[] = [];
  _enumRole = EnumRole;
  months = MONTH_LIST;
  //deletedContracts: number[] = [];
deletedContracts: any[] = [];
  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apprenticeshipService: ITIApprenticeshipService,
    private documentDetailsService: DocumentDetailsService,
    public appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {
    this.CollegeApprovedContractForm = this.formBuilder.group({
      DivisionID: [{ value: '', disabled: true }, [DropdownValidators]],
      DistrictID: [{ value: '', disabled: true }, [DropdownValidators]],
      MonthID: ['', [DropdownValidators]],
    })
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDivisionMaster();
    this.request.DistrictID = this.sSOLoginDataModel.DistrictID
    await this.DivisionData_ByDistrict();
    await this.GetDistictData();
    
    // await this.GetInstituteMaster(this.request.DistrictID);
  }

  get _CollegeApprovedContractForm() { return this.CollegeApprovedContractForm.controls; }

  async GetDivisionMaster() {   
    try {
      await this.commonMasterService.GetDivisionMaster().then((data: any) => {
        this.Divisionlist = data.Data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  GetMonthNumber() {
    let today = new Date();
    let month = today.getMonth() + 1; // January is 0
    return month;
  }


  async GetDistictData() {
    try {
        
      // this.request.DistrictID = 0
      // this.Institutelist = [];
      await this.onChange();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.request.DivisionID))
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.Districtlist = data['Data'];
          this.request.DistrictID = this.sSOLoginDataModel.DistrictID
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetInstituteMaster() {
    try {
      const curr_month = this.GetMonthNumber();
      if (curr_month <= this.request.MonthID) {
        this.Institutelist = [];
        this.request.MonthID = 0;
        this.toastr.error('Please select correct month as You cannot select future or present month');
        return;
      } 

      const request: any = {};
      request.DistrictID = this.request.DistrictID;
      request.EndTermID = this.sSOLoginDataModel.EndTermID;
      request.MonthID = this.request.MonthID;
      request.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      request.action = "GetInstituteList";
      await this.apprenticeshipService.GetITI_InstituteList_Apprenticeship(request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        // this.Institutelist = data['Data']; 
        // this.Institutelist = data['Data'].map((row: any) => ({
        //   ...row,
        //   contracts: [] as ContractEntry[]
        // }));
        const rows = data['Data'];
        const grouped: any = {};
        rows.forEach((r: any) => {
          if (!grouped[r.InstituteID]) {
            grouped[r.InstituteID] = {
            InstituteID: r.InstituteID,
            Name: r.Name,
            contracts: []
            };
          }
          debugger;
          if (r.ContractDate) {
             let fileUrl = null;
             debugger;
            if (r.fileBase64) {
              // Detect MIME type by file extension
              let mimeType = 'application/octet-stream'; // default
              if (r.fileName) {
              const ext = r.fileName.split('.').pop()?.toLowerCase();
              if (ext === 'pdf') mimeType = 'application/pdf';
              else if (ext === 'png') mimeType = 'image/png';
              else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
              }
              fileUrl = `data:${mimeType};base64,${r.fileBase64}`;
              console.log("File URL :"+fileUrl);
            }
            grouped[r.InstituteID].contracts.push({
            date: r.ContractDate.split('T')[0],  // remove time part
            count: r.No_Of_Contract,
            //fileUrl: r.FileUrl || null,          // add file URL from backend
            fileUrl:fileUrl,
            fileName: r.fileName || null         // add file name from backend
            });
          }
        });
        this.Institutelist = Object.values(grouped);
      })
    } catch (error) {
      console.log(error);
    } 
  }

  async DivisionData_ByDistrict() {
    try {
        
      await this.commonMasterService.DivisionData_ByDistrict(Number(this.request.DistrictID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DivisionData = data.Data[0];
          this.request.DivisionID = this.DivisionData.DivisionID
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async SaveData() {
    if(this.CollegeApprovedContractForm.invalid) {
      this.toastr.error('Please fill all the required fields');
      return
    }

    if(this.Institutelist?.length == 0) {
      this.toastr.error('there is no institute');
      return
    }

    try {
      this.Institutelist.forEach((ele: any) => {
        ele.UserID = this.sSOLoginDataModel.UserID;
        ele.EndTermID = this.sSOLoginDataModel.EndTermID;
        ele.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        ele.ZoneID = this.request.DivisionID;
        ele.DistrictID = this.request.DistrictID;
        ele.MonthID = this.request.MonthID;
        ele.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      });

      await this.apprenticeshipService.SaveCollegeApprovedContract_Appr(this.Institutelist).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
async SaveDataNew() {
  if (this.CollegeApprovedContractForm.invalid) {
    this.toastr.error('Please fill all the required fields');
    return;
  }

  if (!this.Institutelist?.length) {
    this.toastr.error('There is no institute');
    return;
  } 
  const payload: any[] = [];
 
  // Add modified rows
  this.Institutelist.forEach((inst:any) => {
    inst.contracts
      .filter((c:any) => c.count > 0)
      .forEach((c:any) => {
        payload.push({
          InstituteID: inst.InstituteID,
          MonthID: this.request.MonthID,
          ZoneID: this.request.DivisionID,
          DistrictID: this.request.DistrictID,
          No_Of_Contract: c.count,
          ContractDate: c.date,
          AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          UserID: this.sSOLoginDataModel.UserID,
           // FILE DATA (SAFE FOR JSON)
          FileBase64: c.fileBase64 || null,
          FileName: c.fileName || null,
          FileUrls: c.fileUrl || null
        });
      });
  });

  // Add deleted rows so SQL can deactivate them
  payload.push(...this.deletedContracts);
  console.log("Payload:", payload);
  debugger;
  if (payload.length === 0) {
    this.toastr.warning("No contract entries to save.");
    return;
  }
  console.log("Payload:", payload);
if (!confirm("Are you sure you want to save these contract entries?")) {
    return;
  }
  try {
    await this.apprenticeshipService.SaveCollegeApprovedContract_Appr(payload).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
        } else if(data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });

  } catch (err) {
    console.log(err);
  }
}

  async onChange() {
    this.Institutelist = [];
    this.request.MonthID = 0;
  }
 onContractChange(contract: ContractEntry, row: Institute, inputRef: HTMLInputElement) {
  const value = Number(contract.count);
    // Block zero value
    if (value === 0) {
      alert("'No of Contract' cannot be 0.");
      contract.count = null;        // Clear the value 
      inputRef.value = '';  
      return;
    }

    // Optional: Block negative values
    if (value < 0) {
      alert("Value cannot be negative.");
      contract.count = null;
      inputRef.value = '';  
    }
}
onDateChange(selectedDate: string, row: any) {
  if (!selectedDate) return;
  // 1️⃣ Check if date already exists
  const existing = row.contracts.find((c: ContractEntry) => c.date === selectedDate);

  // 👉 If user selects SAME DATE → allow it, but DO NOT add new row
  if (existing) {
    alert("Date Already Selected.");
    return;  
  }

// 1️⃣ Check if last contract entry exists AND its count is empty
  if (row.contracts.length > 0) {
    const last = row.contracts[row.contracts.length - 1];
    if (last.count === null || last.count === undefined || last.count === '') {
      alert("Please enter 'No of Contract' before selecting a new date.");
      return; // ❌ Stop adding new entry
    }
    if (Number(last.count) === 0) {
      alert("'No of Contract' cannot be 0. Please enter a valid value.");
      return;
    }
  }
  // Check if date already exists
  const exists = row.contracts.some((c: ContractEntry) => c.date === selectedDate);
  if (exists) return;
  row.contracts.push({
    date: selectedDate,
    count: null
  });
}

removeContract(row: any, index: number) {
  if (!confirm("Are you sure you want to remove this contract?")) {
    return; // ❌ User cancelled
  }
  const removed = row.contracts[index]; 

  if (removed) {
    this.deletedContracts.push({
      InstituteID: row.InstituteID,
      ContractDate: removed.date,
      MonthID: this.request.MonthID,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      UserID: this.sSOLoginDataModel.UserID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      ZoneID: this.request.DivisionID,
      DistrictID: this.request.DistrictID,
      No_Of_Contract: 0  // mark as 0 so SQL knows this is deleted
    });
  }
  row.contracts.splice(index, 1);
}
onFileSelect(event: any, contract: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    contract.fileBase64 = reader.result;  // Base64 string
    contract.fileName = file.name;        // Original name
    contract.fileUrl = reader.result as string;
    console.log("contract.fileUrl:"+contract.fileUrl);
  };
  reader.readAsDataURL(file);             // Convert to Base64
  // this.UploadDocument(file, file.name, file.name).then((res: any) => {
  //   // Suppose server returns the accessible file URL
  //   contract.fileUrl = res.fileUrl;  // e.g., "/uploads/contracts/contract1.pdf"
  //   console.log("File uploaded, URL:", contract.fileUrl);
  // });
}
async UploadDocument(event: any, FileName: any, Dis_FileName:any) {
  try {
    let uploadModel: UploadFileModel = {
      FileName: FileName ?? "",
      FileExtention: "",
      MinFileSize: "20kb",
      MaxFileSize: "50mb",
      FolderName:"CollegeAprrovedContract",
 
    }
    await this.documentDetailsService.UploadDocument(event, uploadModel)
      .then((data: any) => { 
      });
  }
  catch (Ex) {
    console.log(Ex);
  }
}
}
 
interface ContractEntry {
  date: string;
  count: number | null;
}

interface Institute {
  InstituteID: number;
  Name: string;
  contracts: ContractEntry[];
}
