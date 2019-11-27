import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlnCommentComponent } from './fln-comment.component';

describe('FlnCommentComponent', () => {
  let component: FlnCommentComponent;
  let fixture: ComponentFixture<FlnCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlnCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlnCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
