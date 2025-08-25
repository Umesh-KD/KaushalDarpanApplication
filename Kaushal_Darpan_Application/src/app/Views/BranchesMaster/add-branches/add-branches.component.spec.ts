import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBranchesComponent } from './add-branches.component';


describe('AddBranchesComponent', () => {
  let component: AddBranchesComponent;
  let fixture: ComponentFixture<AddBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBranchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBranchesComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
