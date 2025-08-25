import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchToInstituteComponent } from './dispatch-to-institute.component';

describe('DispatchToInstituteComponent', () => {
  let component: DispatchToInstituteComponent;
  let fixture: ComponentFixture<DispatchToInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchToInstituteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchToInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
