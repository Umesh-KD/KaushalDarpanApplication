import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTECommitteListComponent } from './dte-committe-list.component';

describe('DTECommitteListComponent', () => {
  let component: DTECommitteListComponent;
  let fixture: ComponentFixture<DTECommitteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DTECommitteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DTECommitteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
