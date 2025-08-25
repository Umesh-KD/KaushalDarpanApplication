import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchToInstituteRevalComponent } from './dispatch-to-institute-reval.component';

describe('DispatchToInstituteComponent', () => {
  let component: DispatchToInstituteRevalComponent;
  let fixture: ComponentFixture<DispatchToInstituteRevalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchToInstituteRevalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchToInstituteRevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
