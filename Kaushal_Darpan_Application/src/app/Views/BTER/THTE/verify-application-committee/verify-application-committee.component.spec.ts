import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyApplicationCommitteeComponent } from './verify-application-committee.component';

describe('VerifyApplicationCommitteeComponent', () => {
  let component: VerifyApplicationCommitteeComponent;
  let fixture: ComponentFixture<VerifyApplicationCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyApplicationCommitteeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyApplicationCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
