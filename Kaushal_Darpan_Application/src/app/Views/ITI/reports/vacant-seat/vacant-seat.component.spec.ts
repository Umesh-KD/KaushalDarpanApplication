import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VacantSeatComponent } from './vacant-seat.component';

describe('FinalAdmissionComponent', () => {
  let component: VacantSeatComponent;
  let fixture: ComponentFixture<VacantSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VacantSeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacantSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
