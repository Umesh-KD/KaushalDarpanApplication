import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterRollListComponent } from './center-roll-list.component';

describe('CenterRollListComponent', () => {
  let component: CenterRollListComponent;
  let fixture: ComponentFixture<CenterRollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterRollListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterRollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
