import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectHostelAllotmentComponent } from './direct-hostel-allotment.component';

describe('DirectHostelAllotmentComponent', () => {
  let component: DirectHostelAllotmentComponent;
  let fixture: ComponentFixture<DirectHostelAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectHostelAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectHostelAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
