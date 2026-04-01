import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatIntakesMasterComponent} from './add-seat-intakes-master.component';

describe('AddSeatIntakesComponent', () => {
  let component: AddSeatIntakesMasterComponent;
  let fixture: ComponentFixture<AddSeatIntakesMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSeatIntakesMasterComponent]
    });
    fixture = TestBed.createComponent(AddSeatIntakesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
