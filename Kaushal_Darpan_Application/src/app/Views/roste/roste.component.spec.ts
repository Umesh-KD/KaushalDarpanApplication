import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosteComponent } from './roste.component';

describe('RosteComponent', () => {
  let component: RosteComponent;
  let fixture: ComponentFixture<RosteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
