import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSubjectsComponent } from './common-subjects.component';

describe('CommonSubjectsComponent', () => {
  let component: CommonSubjectsComponent;
  let fixture: ComponentFixture<CommonSubjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonSubjectsComponent]
    });
    fixture = TestBed.createComponent(CommonSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
