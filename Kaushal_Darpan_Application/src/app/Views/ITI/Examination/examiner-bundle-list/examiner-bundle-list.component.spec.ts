import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerBundleListComponent } from './examiner-bundle-list.component';

describe('ExaminerBundleListComponent', () => {
  let component: ExaminerBundleListComponent;
  let fixture: ComponentFixture<ExaminerBundleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExaminerBundleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminerBundleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
