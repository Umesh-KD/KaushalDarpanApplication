import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectedMeritListComponent } from './Corrected-Merit-List.component';

describe('StudentRequestListComponent', () => {
  let component: CorrectedMeritListComponent;
  let fixture: ComponentFixture<CorrectedMeritListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrectedMeritListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectedMeritListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
