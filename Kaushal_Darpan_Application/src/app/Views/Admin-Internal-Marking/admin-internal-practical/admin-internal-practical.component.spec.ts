import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInternalPracticalComponent } from './admin-internal-practical.component';

describe('AdminInternalPracticalComponent', () => {
  let component: AdminInternalPracticalComponent;
  let fixture: ComponentFixture<AdminInternalPracticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInternalPracticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInternalPracticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
