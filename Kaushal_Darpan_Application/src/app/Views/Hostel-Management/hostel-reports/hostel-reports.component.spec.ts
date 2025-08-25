import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelReportsComponent } from './hostel-reports.component';

describe('HostelReportsComponent', () => {
  let component: HostelReportsComponent;
  let fixture: ComponentFixture<HostelReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostelReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
