import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationTabComponent } from './revaluation-tab.component';

describe('RevaluationTabComponent', () => {
  let component: RevaluationTabComponent;
  let fixture: ComponentFixture<RevaluationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevaluationTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevaluationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
