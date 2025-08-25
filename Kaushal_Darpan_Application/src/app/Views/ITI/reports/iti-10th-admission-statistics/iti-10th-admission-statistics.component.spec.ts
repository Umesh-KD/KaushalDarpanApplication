import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti10ThAddmissionStatisticsComponent } from './iti-10th-admission-statistics.component';

describe('ItiCertificateComponent', () => {
  let component: Iti10ThAddmissionStatisticsComponent;
  let fixture: ComponentFixture<Iti10ThAddmissionStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti10ThAddmissionStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti10ThAddmissionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
