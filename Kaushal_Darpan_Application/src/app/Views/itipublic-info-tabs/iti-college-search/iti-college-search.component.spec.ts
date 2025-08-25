import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ItiCollegeSearchComponent } from "./iti-college-search.component";


describe('KnowMeritITIComponent', () => {
  let component: ItiCollegeSearchComponent;
  let fixture: ComponentFixture<ItiCollegeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiCollegeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCollegeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
