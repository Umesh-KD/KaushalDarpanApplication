import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokePartiallyDetainedStudentsComponent } from './revoke-partially-detained-students.component';

describe('RevokePartiallyDetainedStudentsComponent', () => {
  let component: RevokePartiallyDetainedStudentsComponent;
  let fixture: ComponentFixture<RevokePartiallyDetainedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevokePartiallyDetainedStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevokePartiallyDetainedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
