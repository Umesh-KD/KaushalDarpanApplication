import { ComponentFixture, TestBed } from "@angular/core/testing";
import { bterCollegeSearchComponent } from "./bter-college-search.component";


describe('KnowMeritITIComponent', () => {
  let component: bterCollegeSearchComponent;
  let fixture: ComponentFixture<bterCollegeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [bterCollegeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(bterCollegeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
