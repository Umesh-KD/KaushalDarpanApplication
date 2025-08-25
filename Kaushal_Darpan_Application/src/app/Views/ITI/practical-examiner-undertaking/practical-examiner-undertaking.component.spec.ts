import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticalExaminerUndertakingComponent } from './practical-examiner-undertaking.component';

describe('PracticalExaminerUndertakingComponent', () => {
  let component: PracticalExaminerUndertakingComponent;
  let fixture: ComponentFixture<PracticalExaminerUndertakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticalExaminerUndertakingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticalExaminerUndertakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
