import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommonSubjectsComponent } from './add-common-subjects.component';

describe('AddCommonSubjectsComponent', () => {
  let component: AddCommonSubjectsComponent;
  let fixture: ComponentFixture<AddCommonSubjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCommonSubjectsComponent]
    });
    fixture = TestBed.createComponent(AddCommonSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
