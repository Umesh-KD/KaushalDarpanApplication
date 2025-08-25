import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyRollListComponent } from './verify-roll-list.component';

describe('VerifyRollListComponent', () => {
  let component: VerifyRollListComponent;
  let fixture: ComponentFixture<VerifyRollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyRollListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyRollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
