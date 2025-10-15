import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THTECommitteeafterPrincipleApplicationListComponent } from './thte-committee-afterprinciple-application-list.component';

describe('THTECommitteeafterPrincipleApplicationListComponent', () => {
  let component: THTECommitteeafterPrincipleApplicationListComponent;
  let fixture: ComponentFixture<THTECommitteeafterPrincipleApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [THTECommitteeafterPrincipleApplicationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(THTECommitteeafterPrincipleApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
