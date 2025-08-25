import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti8ThAddmissionStatisticsComponent } from './iti-8th-admission-statistics.component';

describe('ItiCertificateComponent', () => {
  let component: Iti8ThAddmissionStatisticsComponent;
  let fixture: ComponentFixture<Iti8ThAddmissionStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti8ThAddmissionStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti8ThAddmissionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
