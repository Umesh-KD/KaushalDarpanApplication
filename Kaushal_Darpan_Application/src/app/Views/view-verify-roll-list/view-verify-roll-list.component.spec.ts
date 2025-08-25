import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerifyRollListComponent } from './view-verify-roll-list.component';

describe('ViewVerifyRollListComponent', () => {
  let component: ViewVerifyRollListComponent;
  let fixture: ComponentFixture<ViewVerifyRollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewVerifyRollListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVerifyRollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
