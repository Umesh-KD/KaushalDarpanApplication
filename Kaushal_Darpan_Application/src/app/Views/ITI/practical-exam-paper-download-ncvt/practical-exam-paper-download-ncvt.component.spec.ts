import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticalExamPaperDownloadNCVTComponent } from './practical-exam-paper-download-ncvt.component';

describe('PracticalExamPaperDownloadNCVTComponent', () => {
  let component: PracticalExamPaperDownloadNCVTComponent;
  let fixture: ComponentFixture<PracticalExamPaperDownloadNCVTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticalExamPaperDownloadNCVTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticalExamPaperDownloadNCVTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
