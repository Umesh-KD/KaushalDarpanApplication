import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSectionCreateComponent } from './branch-section-create.component';

describe('BranchSectionCreateComponent', () => {
  let component: BranchSectionCreateComponent;
  let fixture: ComponentFixture<BranchSectionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchSectionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchSectionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
