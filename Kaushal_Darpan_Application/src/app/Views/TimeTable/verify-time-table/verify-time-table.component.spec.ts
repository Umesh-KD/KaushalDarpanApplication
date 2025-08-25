import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyTimeTableComponent } from './verify-time-table.component';

describe('VerifyTimeTableComponent', () => {
  let component: VerifyTimeTableComponent;
  let fixture: ComponentFixture<VerifyTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyTimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
