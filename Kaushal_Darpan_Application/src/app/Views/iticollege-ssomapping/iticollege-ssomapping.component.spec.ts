import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITICollegeSSOMappingComponent } from './iticollege-ssomapping.component';

describe('ITICollegeSSOMappingComponent', () => {
  let component: ITICollegeSSOMappingComponent;
  let fixture: ComponentFixture<ITICollegeSSOMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITICollegeSSOMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITICollegeSSOMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
