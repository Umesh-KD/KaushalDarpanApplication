import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-bter-reports',
  standalone: false,
  templateUrl: './bter-reports.component.html',
  styleUrl: './bter-reports.component.css'
})
export class BterReportsComponent implements OnInit {
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  ngOnInit() {

  }

  public downloadEnrollmentPDF() {
    const margin = 10; // Define margin size
    const pageWidth = 210 - 2 * margin; // A4 width (210mm) minus left & right margins
    const pageHeight = 200 - 2 * margin; // 500mm height minus top & bottom margins

    const doc = new jsPDF({
      orientation: 'p', // Portrait mode
      unit: 'mm',
      format: [210, 300], // A4 width (210mm) and custom height (500mm)
    });

    const pdfTable = this.pdfTable.nativeElement;
    const editorElement = document.getElementById('editor');

    if (editorElement) {
      editorElement.classList.add('customEditorStyle');
    }

    doc.html(pdfTable, {
      callback: function (doc) {
        doc.save('enrollment.pdf');

        if (editorElement) {
          editorElement.classList.remove('customEditorStyle');
        }
      },
      x: margin, // Apply left margin
      y: margin, // Apply top margin
      width: pageWidth, // Adjust width to fit within margins
      windowWidth: pdfTable.scrollWidth, // Ensures full content width
    });
  }

}
