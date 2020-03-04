import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharlesInfoComponent } from './charles-info.component';

describe('CharlesInfoComponent', () => {
  let component: CharlesInfoComponent;
  let fixture: ComponentFixture<CharlesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharlesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharlesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
