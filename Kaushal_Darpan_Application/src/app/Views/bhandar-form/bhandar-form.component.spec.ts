import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhandarFormComponent } from './bhandar-form.component';

describe('BhandarFormComponent', () => {
  let component: BhandarFormComponent;
  let fixture: ComponentFixture<BhandarFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BhandarFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BhandarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
