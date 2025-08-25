import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationFormComponent } from './qualification-form.component';

describe('QualificationFormComponent', () => {
  let component: QualificationFormComponent;
  let fixture: ComponentFixture<QualificationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualificationFormComponent]
    });
    fixture = TestBed.createComponent(QualificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
