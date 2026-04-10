import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroCategoria } from './cadastroCategoria';

describe('CadastroCategoria', () => {
  let component: CadastroCategoria;
  let fixture: ComponentFixture<CadastroCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCategoria],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
