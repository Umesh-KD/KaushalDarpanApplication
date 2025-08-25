import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevalExaminersComponent } from './reval-examiners.component';

describe('ExaminersComponent', () => {
  let component: RevalExaminersComponent;
  let fixture: ComponentFixture<RevalExaminersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevalExaminersComponent]
    });
    fixture = TestBed.createComponent(RevalExaminersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
