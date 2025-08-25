import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITITimeTableComponent } from './ititime-table.component';

describe('ITITimeTableComponent', () => {
  let component: ITITimeTableComponent;
  let fixture: ComponentFixture<ITITimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITITimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITITimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
