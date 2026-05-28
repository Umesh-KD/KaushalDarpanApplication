import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class CommonFunctionHelper {

  constructor(private http: HttpClient) {

  }

  public truncateText(text: string, limit: number = 25): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  public getRouterLinkURL(value: string) {
    let hasQS = value.includes('?');
    if (hasQS) {
      value = value.split('?')[0];
    }
    return value;
  }

  public getQueryParams(value: string) {
    let dynamicQSParams: any = {};
    let hasQS = value.includes('?');
    if (hasQS) {
      const queryString = value.split('?')[1];
      const params = new URLSearchParams(queryString);

      params.forEach((val, key) => {
        dynamicQSParams[key] = val;
      });
    }
    return dynamicQSParams;
  }

  public downloadBase64OfWord(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  public downloadBase64OfPdf(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  numbersOnly(event: KeyboardEvent) {
    // Allow control keys
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Allow only digits
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  async downloadFileFromServer(fileFolder: string, fileName: string) {
    let fullfilepath = fileFolder + "/" + fileName;
    // Fetch the file as a blob
    this.http.get(fullfilepath, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = fileName; // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  async blobToBase64(blob: Blob) {
    const buffer = await blob.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);

    bytes.forEach(byte => binary += String.fromCharCode(byte));

    return btoa(binary);
  }

  public downloadBase64OfZip(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/zip' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

}
