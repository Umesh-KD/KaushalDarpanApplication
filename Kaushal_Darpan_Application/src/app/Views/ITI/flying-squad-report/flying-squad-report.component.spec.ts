import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyingSquadReportComponent } from './flying-squad-report.component';

describe('FlyingSquadReportComponent', () => {
  let component: FlyingSquadReportComponent;
  let fixture: ComponentFixture<FlyingSquadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlyingSquadReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlyingSquadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
