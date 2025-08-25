import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchWiseHodComponent } from './branch-wise-hod.component';

describe('BranchWiseHodComponent', () => {
  let component: BranchWiseHodComponent;
  let fixture: ComponentFixture<BranchWiseHodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchWiseHodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchWiseHodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
