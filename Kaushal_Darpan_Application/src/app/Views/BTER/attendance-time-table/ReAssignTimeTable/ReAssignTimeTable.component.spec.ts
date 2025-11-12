import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignTimeTableComponent } from './ReAssignTimeTable.component';

describe('ReAssignTimeTableComponent', () => {
  let component: ReAssignTimeTableComponent;
  let fixture: ComponentFixture<ReAssignTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReAssignTimeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReAssignTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
