import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpwardMomentITIComponent } from './upward-moment-iti.component';

describe('UpwardMomentITIComponent', () => {
  let component: UpwardMomentITIComponent;
  let fixture: ComponentFixture<UpwardMomentITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpwardMomentITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpwardMomentITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
