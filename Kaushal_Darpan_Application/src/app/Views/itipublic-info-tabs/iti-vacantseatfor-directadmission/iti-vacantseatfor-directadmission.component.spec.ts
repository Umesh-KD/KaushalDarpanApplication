import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ItiVacantSeatDirectAdmissionComponent } from "./iti-vacantseatfor-directadmission.component";


describe('KnowMeritITIComponent', () => {
  let component: ItiVacantSeatDirectAdmissionComponent;
  let fixture: ComponentFixture<ItiVacantSeatDirectAdmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiVacantSeatDirectAdmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiVacantSeatDirectAdmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
