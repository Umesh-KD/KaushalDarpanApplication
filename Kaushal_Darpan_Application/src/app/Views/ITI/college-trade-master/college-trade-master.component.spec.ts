import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeTradeMasterComponent } from './college-trade-master.component';

describe('CollegeTradeMasterComponent', () => {
  let component: CollegeTradeMasterComponent;
  let fixture: ComponentFixture<CollegeTradeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegeTradeMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeTradeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
