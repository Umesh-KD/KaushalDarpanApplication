import { Component } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-config-encryptor',
  standalone: false,
  templateUrl: './config-encryptor.component.html',
  styleUrl: './config-encryptor.component.css'
})
export class ConfigEncryptorComponent {
  inputJson: string = '';
  outputJson: string = '';

  // crypto config (same as encrypt tool)
  private key = CryptoJS.enc.Utf8.parse('1234567890123456');
  private iv = CryptoJS.enc.Utf8.parse('1234567890123456');

  // Handle file upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.inputJson = e.target.result;
    };
    reader.readAsText(file);
  }

  // Encrypt
  encrypt() {
    try {
      if (!this.inputJson) {
        alert('Please upload or paste JSON');
        return;
      }

      JSON.parse(this.inputJson); // validate

      const encrypted = CryptoJS.AES.encrypt(
        this.inputJson,
        this.key,
        {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      ).toString();

      const result = {
        data: encrypted
      };

      this.outputJson = JSON.stringify(result, null, 2);

    } catch (e) {
      alert('Invalid JSON');
    }
  }

  // Copy
  copyOutput() {
    navigator.clipboard.writeText(this.outputJson);
    alert('Copied to clipboard');
  }

  // Download file
  downloadFile() {
    if (!this.outputJson) {
      alert('Nothing to download');
      return;
    }

    const blob = new Blob([this.outputJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted.enc.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
