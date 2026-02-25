import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class CommonFunctionHelper {

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

}
