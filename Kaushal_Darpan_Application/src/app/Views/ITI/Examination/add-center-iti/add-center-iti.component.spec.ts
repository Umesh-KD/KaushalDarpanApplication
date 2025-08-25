import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCenterITIComponent } from './add-center-iti.component';

describe('AddCenterITIComponent', () => {
  let component: AddCenterITIComponent;
  let fixture: ComponentFixture<AddCenterITIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCenterITIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCenterITIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
