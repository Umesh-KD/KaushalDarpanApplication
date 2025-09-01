// src/app/excel-upload/excel-upload.component.ts
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ITI_NCVTService } from '../../../Services/ITI-NVCT/iti-nvct.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { Router } from '@angular/router';

interface ChunkGroup {
  chunkIndex: number;
  range: string;
  count: number;
  progress: number; // 0..100 (100 => done), -1 => pending, -2 => failed
  uploading?: boolean;
}
@Component({
  selector: 'app-ncvt-data-bulk-upload',
  standalone: false,
  templateUrl: './ncvt-data-bulk-upload.component.html',
  styleUrl: './ncvt-data-bulk-upload.component.css'
})


export class NcvtDataBulkUploadComponent implements AfterViewInit, OnInit
{
  displayedColumns: string[] = ['chunk', 'range', 'count', 'progress'];
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public FileName:string=''
  public Dis_FileName:string=''
  public ExcelImportID:number=0
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ExcelFile:any=''


  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Excel / chunking state
  excelData: any[] = [];
  sessionId = '';
  chunkSize = 3000;
  chunkGroups: ChunkGroup[] = [];
  totalChunks = 0;
  isUploading = false;


  expectedHeaders: string[] = ['EmployeeID', 'Name', 'Department', 'Salary']; // <-- define required headers

  constructor(private ncvtService: ITI_NCVTService, private commonMasterService: CommonFunctionService, private toastr: ToastrService, private swal: SweetAlert2, private router: Router)
  {
  }

  async ngOnInit()
  {
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
  }
  async onFilechange1(event: any) {
    try {

      debugger;
      const file = event.target.files[0];
      this.ExcelFile = event.target.files[0];
      if (file)
      {
        if (await this.ValidateExcelHeader())
        {

          let uploadModel = new UploadFileModel();
          uploadModel.FileExtention = file.type ?? "";
          uploadModel.MinFileSize = "";
          uploadModel.MaxFileSize = "2000000";
          uploadModel.FolderName = "ITI/NcvtData";

          // upload to server folder
          /*this.loaderService.requestStarted();*/

          await this.commonMasterService.UploadDocument(file, uploadModel)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              debugger
              if (this.State == EnumStatus.Success) {
                this.Dis_FileName = data['Data'][0]["Dis_FileName"];
                this.FileName = data['Data'][0]["FileName"];
                //else if (Type == "Sign") {
                //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
                //}
                /*              item.FilePath = data['Data'][0]["FilePath"];*/
                /*    event.target.value = null;*/
              }
              if (this.State == EnumStatus.Error) {
                this.toastr.error(this.ErrorMessage)
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.ErrorMessage)
              }
            });
        }
        else
        {
          event.target.value = null
        }

      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
 
      /*  }, 200);*/
    }
  }



  // parse excel
  onFileChange()
  {
    this.isUploading = true;
   
    /*   const file = event.target.files?.[0];*/
    const file = this.ExcelFile
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      this.excelData = XLSX.utils.sheet_to_json(sheet, { defval: null });

      // preview first N rows in table (or all but paginate via mat-paginator)
      this.dataSource.data = this.excelData;
      // prepare chunk groups but don't start uploading yet
      this.prepareChunks();
    };
    reader.readAsArrayBuffer(file);
    // ...
    this.isUploading = false;
  }


  ValidateExcelHeader(): Promise<boolean> {
    return new Promise((resolve) => {
      const file = this.ExcelFile;
      if (!file) return resolve(false);

      const expectedHeaders = [
        'id', 'student_exam_id', 'RegNo', 'roll_no', 'Exam_Type',
        'DGT_code', 'Inst_Code', 'shift', 'unit', 'Type',
        'Trade_code', 'Course_duration', 'Practical', 'Paper1', 'Paper2',
        'paper3', 'paper4', 'Name', 'father_name',
        'institute_id', 'institute_name', 'stream_id', 'stream_name',
        'trade_type', 'trade_scheme_type', 'Exam_Fees'
      ];

      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
      const reader = new FileReader();

      reader.onload = (e: any) =>
      {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const actualHeaders = this.getActualHeaders(sheet);
          if (!actualHeaders.length)
          {
            this.swal.Info('❌ Could not detect a header row in the sheet.');
            return resolve(false);
          }
          const missing = expectedHeaders.filter(req =>
            !actualHeaders.some(h => normalize(h) === normalize(req))
          );
          if (missing.length)
          {
            this.swal.Info(`❌ Invalid Excel format.<br/>Missing: ${missing.join(', ')}`);
            console.log("Found headers:", actualHeaders.join(', '));
            return resolve(false);
          }
          this.swal.Success('Excel headers are valid.');
          return resolve(true);

        }catch (err)
        {
          console.error(err);
          this.swal.Info('❌ Failed to read Excel file.');
          return resolve(false);
        } finally {
          this.isUploading = false;
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }



  private getActualHeaders(sheet: XLSX.WorkSheet): string[] {
    // Try: rows as arrays (header: 1)
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(
      sheet,
      { header: 1, defval: null, blankrows: false }
    ) as (string | number | null)[][];

    if (Array.isArray(rows) && rows.length) {
      // find the first non-empty row to treat as header
      const headerRow = rows.find(r => Array.isArray(r) && r.some(c => c !== null && c !== undefined && String(c).trim() !== ''));
      if (headerRow) {
        return headerRow.map(c => String(c ?? '').trim());
      }
    }

    // Fallback: if someone parsed without header:1, use object keys
    const objRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: null });
    if (Array.isArray(objRows) && objRows.length) {
      return Object.keys(objRows[0] ?? {}).map(k => k.trim());
    }

    return [];
  }




  prepareChunks() {
    this.chunkGroups = [];
    if (!this.excelData?.length) return;
    this.totalChunks = Math.ceil(this.excelData.length / this.chunkSize);

    for (let i = 0; i < this.totalChunks; i++) {
      const start = i * this.chunkSize;
      const chunkLength = Math.min(this.chunkSize, this.excelData.length - start);
      this.chunkGroups.push({
        chunkIndex: i + 1,
        range: `${start + 1} - ${start + chunkLength}`,
        count: chunkLength,
        progress: 0
      });
    }
  }

  // Start a fresh upload (new session)
  async startUpload() {
    if (!this.excelData?.length) { alert('Please select an Excel file first'); return; }
    this.sessionId = '12'
    // Mark all as pending (0)
    this.chunkGroups.forEach(g => { g.progress = 0; g.uploading = false; });
    await this.uploadAllChunks();
  }

  // Resume upload: check server for uploaded chunks, skip them
  async resumeUpload() {
    if (!this.sessionId) { alert('No sessionId found. Start new upload first.'); return; }
    //try {
    //  const uploaded = await this.uploadService.getUploadedChunks(this.sessionId).toPromise();
    //  const set = new Set(uploaded || []);
    //  this.chunkGroups.forEach(g => {
    //    if (set.has(g.chunkIndex)) g.progress = 100;
    //    else g.progress = 0;
    //  });
    //  await this.uploadAllChunks();
    //} catch (err) {
    //  console.error('Failed to fetch uploaded chunks', err);
    //  alert('Failed to fetch uploaded chunks. Check console.');
    //}
  }

  // internal: upload pending chunks sequentially
  async uploadAllChunks() {
    if (this.isUploading) return;
    this.isUploading = true;

    for (let i = 0; i < this.chunkGroups.length; i++)
    {
      const g = this.chunkGroups[i];
      if (g.progress === 100) continue; // already uploaded

      g.uploading = true;
      g.progress = -1; // indeterminate UI state

      const start = (g.chunkIndex - 1) * this.chunkSize;
      const chunkRows = this.excelData.slice(start, start + g.count);

      const body =
      {
        sessionId: this.sessionId,
        chunkIndex: g.chunkIndex,
        totalChunks: this.totalChunks,
        FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        CreatedBy: this.sSOLoginDataModel.UserID,
        IPAddress: "",
        ListData: chunkRows,
        ExcelImportID: this.ExcelImportID
      };
      try
      {
        await this.SaveExamData(body); 
        g.progress = 100;
      
      } catch (err)
      {
        console.error('Chunk upload failed', g.chunkIndex, err);
        g.progress = -2; // failed
        alert(`Chunk ${g.chunkIndex} failed. You can retry/resume later.`);
        break;
      } finally {
        g.uploading = false;
      }
    }
    //

    this.swal.Confirmation("Your file has been uploaded successfully", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed)
      {

        this.router.navigate(['/iti_ncvt_data_import']);

      }
    },'OK', false
    );

    this.isUploading = false;
  }


  // helper for UI to show label
  progressLabel(p: number)
  {
    if (p === 0) return 'Pending';
    if (p === -1) return 'Uploading...';
    if (p === -2) return 'Failed';
    return `${p}%`;
  }

  // optional: retry a single failed chunk
  async retryChunk(chunkIndex: number) {
    const g = this.chunkGroups.find(x => x.chunkIndex === chunkIndex);
    if (!g) return;
    if (g.progress !== -2) return;

    g.uploading = true;
    g.progress = -1;
    const start = (g.chunkIndex - 1) * this.chunkSize;
    const chunkRows = this.excelData.slice(start, start + g.count);
    const body =
    {

      FinancialYearID : this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CreatedBy: this.sSOLoginDataModel.UserID,
      IPAddress : "",
      sessionId: this.sessionId,
      chunkIndex: g.chunkIndex,
      totalChunks: this.totalChunks,
      rows: chunkRows
    };


    const enrichedRows = chunkRows.map(r => ({
      ...r,
      FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CreatedBy: this.sSOLoginDataModel.UserID,
      IPAddress: ""
    }));


    try
    {
      await this.SaveExamData(enrichedRows); 
      g.progress = 100;
    } catch (err) {
      console.error('Retry failed', err);
      g.progress = -2;
      alert(`Retry failed for chunk ${g.chunkIndex}`);
    } finally {
      g.uploading = false;
    }
  }



  async SaveExamData(chunkRows:any) {

    try
      {


      await this.ncvtService.SaveExamDataBulk(chunkRows)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success)
          {
           
          }
          else if (this.State == EnumStatus.Warning)
          {
           
          }
          else
          {
           
          }
        })
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
       
      }, 200);
    }
  }


  async OnExcelUpload() {

    try {
      let obj = {
        FileName: this.FileName,
        Dis_FileName: this.Dis_FileName,
        CreatedBy: this.sSOLoginDataModel.UserID,
        FinYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermID: this.sSOLoginDataModel.EndTermID

      }

      await this.ncvtService.SaveImportFileName(obj)
        .then(async (data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          debugger
          if (this.State == EnumStatus.Success) {
            this.ExcelImportID = data['Data']
            this.onFileChange()
          }
          else if (this.State == EnumStatus.Warning) {

          }
          else {

          }
        })
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {

      }, 200);
    }
  }



}
