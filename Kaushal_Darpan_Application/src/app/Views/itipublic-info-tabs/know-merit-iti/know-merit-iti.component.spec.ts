import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowMeritITIComponent } from './know-merit-iti.component';

describe('KnowMeritITIComponent', () => {
  let component: KnowMeritITIComponent;
  let fixture: ComponentFixture<KnowMeritITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowMeritITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnowMeritITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
