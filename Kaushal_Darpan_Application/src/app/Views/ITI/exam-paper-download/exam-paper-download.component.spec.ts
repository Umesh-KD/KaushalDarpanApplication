import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPaperDownloadComponent } from './exam-paper-download.component';

describe('ExamPaperDownloadComponent', () => {
  let component: ExamPaperDownloadComponent;
  let fixture: ComponentFixture<ExamPaperDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamPaperDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamPaperDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
