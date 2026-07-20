import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ItiTradeSearchComponent } from "./iti-trade-search.component";


describe('KnowMeritITIComponent', () => {
  let component: ItiTradeSearchComponent;
  let fixture: ComponentFixture<ItiTradeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiTradeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiTradeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
