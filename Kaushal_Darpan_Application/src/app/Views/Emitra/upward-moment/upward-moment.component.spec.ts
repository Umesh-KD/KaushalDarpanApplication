import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpwardMomentComponent } from './upward-moment.component';

describe('UpwardMomentComponent', () => {
  let component: UpwardMomentComponent;
  let fixture: ComponentFixture<UpwardMomentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpwardMomentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpwardMomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
