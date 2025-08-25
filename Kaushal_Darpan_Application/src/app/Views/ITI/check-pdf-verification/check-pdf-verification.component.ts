import { Component, inject } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import * as pdfjsLib from 'pdfjs-dist';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


// ✅ Set stable worker version from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

@Component({
  selector: 'app-check-pdf-verification',
  templateUrl: './check-pdf-verification.component.html',
  styleUrls: ['./check-pdf-verification.component.css'],
  standalone: false
})
export class CheckPdfVerificationComponent {
  http = inject(HttpClient);
  appsettingConfig = inject(AppsettingService);
  sanitizer = inject(DomSanitizer);

  isError: boolean = false;
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  imageSrc: string | null = null;
  //DownloadFile(FileName: string): void {
  //  const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ITIReportsFolder}/${FileName}`;

  //  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
  //    const blobUrl = URL.createObjectURL(blob);

  //    // Set for preview
  //    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
  //    this.pdfUrl = blobUrl;
  //    this.isPdf = true;
  //    this.isImage = false;
  //    this.showPdfModal = true;
  //  });
  //}
  DownloadFile(FileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ITIReportsFolder}/${FileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(async (blob: Blob) => {
      try {
        const arrayBuffer = await blob.arrayBuffer(); // Read once

        let password: string | undefined;

        while (true) {
          try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0), password });
            await loadingTask.promise;

            alert('✅ Password verified successfully!');
            break;
          } catch (error: any) {
            if (error?.name === 'PasswordException') {
              const { NEED_PASSWORD, INCORRECT_PASSWORD } = pdfjsLib.PasswordResponses;
              if (error.code === NEED_PASSWORD) {
                password = prompt('🔐 Enter PDF password:') ?? '';
              } else if (error.code === INCORRECT_PASSWORD) {
                password = prompt('❌ Incorrect password, try again:') ?? '';
              } else {
                alert('⚠️ Password error: ' + error.message);
                return;
              }
            } else {
              alert('❌ Failed to load PDF: ' + (error?.message || 'Unknown error'));
              console.error('PDF load error:', error);
              return;
            }
          }
        }

        // ✅ If reached here, open preview in modal
        const verifiedBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(verifiedBlob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.pdfUrl = blobUrl;
        this.isPdf = true;
        this.showPdfModal = true;

      } catch (e) {
        console.error('Fatal error:', e);
        alert('❌ Could not load or verify the PDF file.');
      }
    });
  }





  ClosePopupAndGenerateAndViewPdf(): void {
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
  }

}
