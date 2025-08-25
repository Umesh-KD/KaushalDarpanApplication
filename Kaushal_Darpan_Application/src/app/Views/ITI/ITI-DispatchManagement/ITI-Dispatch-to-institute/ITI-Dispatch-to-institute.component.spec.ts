import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDispatchToInstituteComponent } from './ITI-Dispatch-to-institute.component';

describe('DispatchToInstituteComponent', () => {
  let component: ITIDispatchToInstituteComponent;
  let fixture: ComponentFixture<ITIDispatchToInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIDispatchToInstituteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDispatchToInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
