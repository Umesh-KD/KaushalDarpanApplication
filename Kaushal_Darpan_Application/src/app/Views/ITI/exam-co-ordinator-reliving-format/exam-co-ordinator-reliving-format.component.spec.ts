import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCoOrdinatorRelivingFormatComponent } from './exam-co-ordinator-reliving-format.component';

describe('ExamCoOrdinatorRelivingFormatComponent', () => {
  let component: ExamCoOrdinatorRelivingFormatComponent;
  let fixture: ComponentFixture<ExamCoOrdinatorRelivingFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamCoOrdinatorRelivingFormatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamCoOrdinatorRelivingFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
