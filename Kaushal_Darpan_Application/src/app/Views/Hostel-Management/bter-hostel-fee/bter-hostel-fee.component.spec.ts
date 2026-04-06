import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterHostelFeeComponent } from './bter-hostel-fee.component';

describe('BterHostelFeeComponent', () => {
  let component: BterHostelFeeComponent;
  let fixture: ComponentFixture<BterHostelFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterHostelFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterHostelFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
