import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
  providedIn: 'root'
})

export class FontsService {

  constructor(private http: HttpClient) { }

    public async getHindiFontRegular(): Promise<string> {
    const fontBlob = await this.http
      .get('/assets/fonts/NotoSansDevanagari-Regular.ttf', { responseType: 'blob' })
      .toPromise();

    return (await this.blobToBase64(fontBlob? fontBlob : new Blob())).split(',')[1]; 
  }

  public async getHindiFontBold(): Promise<string> {
    const fontBlob = await this.http
      .get('/assets/fonts/NotoSansDevanagari-Bold.ttf', { responseType: 'blob' })
      .toPromise();

    return (await this.blobToBase64(fontBlob? fontBlob : new Blob())).split(',')[1]; 
  }

    public async getEnglishFontRegular(): Promise<string> {
        const fontBlob = await this.http
        .get('/assets/fonts/Roboto-Regular.ttf', { responseType: 'blob' })
        .toPromise();
    
        return (await this.blobToBase64(fontBlob? fontBlob : new Blob())).split(',')[1]; 
    }

    public async getEnglishFontBold(): Promise<string> {
        const fontBlob = await this.http
        .get('/assets/fonts/Roboto-Bold.ttf', { responseType: 'blob' })
        .toPromise();
    
        return (await this.blobToBase64(fontBlob? fontBlob : new Blob())).split(',')[1]; 
    }

    public checkStringHaveEnglish(str: string): boolean {
        return /^[A-Za-z0-9\s.,!@#$%^&*()_\-+=;:'"\/\\|{}\[\]<>?`~]*$/.test(str);
    }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob); 
    });
  }
}