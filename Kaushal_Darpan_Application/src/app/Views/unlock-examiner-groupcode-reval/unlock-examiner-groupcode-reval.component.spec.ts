import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockExaminerGroupcodeRevalComponent } from './unlock-examiner-groupcode-reval.component';

describe('UnlockExaminerGroupcodeRevalComponent', () => {
  let component: UnlockExaminerGroupcodeRevalComponent;
  let fixture: ComponentFixture<UnlockExaminerGroupcodeRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlockExaminerGroupcodeRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockExaminerGroupcodeRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
