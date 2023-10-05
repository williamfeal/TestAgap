import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { Hero, Publisher } from '../interfaces/hero.interface';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService]
    });
    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Ensure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch heroes from assets', () => {
    const mockHeroes = [{
      id: '1',
      superhero: 'Superman',
      publisher: Publisher.DCComics,
      alter_ego: 'Clark Kent',
      first_appearance: 'Action Comics #1',
      characters: 'Clark Kent',
    }];

    service.loadHeroesFromAssets().subscribe(heroes => {
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne('assets/db.json');
    expect(req.request.method).toBe('GET');
    req.flush({ heroes: mockHeroes });
  });

  it('should return hero by id', () => {
    const hero: Hero = {
      id: '1',
      superhero: 'Superman',
      publisher: Publisher.DCComics,
      alter_ego: 'Clark Kent',
      first_appearance: 'Action Comics #1',
      characters: 'Clark Kent',
    };

    service['heroes'] = [hero]; // Directly assigning heroes for testing purpose
    service.getHeroById('1').subscribe(h => {
      expect(h).toEqual(hero);
    });
  });

  it('should add a hero', () => {
    const newHero: Hero = {
      id: '2',
      superhero: 'Iron Man',
      publisher: Publisher.MarvelComics,
      alter_ego: 'Tony Stark',
      first_appearance: 'Tales of Suspense #39',
      characters: 'Tony Stark',
    };

    service.addHero(newHero).subscribe(hero => {
      expect(hero).toEqual(newHero);
      expect(service['heroes']).toContain(newHero);
    });
  });

  it('should update a hero', () => {
    const updatedHero: Hero = {
      id: '1',
      superhero: 'Superman Updated',
      publisher: Publisher.DCComics,
      alter_ego: 'Clark Kent Updated',
      first_appearance: 'Action Comics #1',
      characters: 'Clark Kent',
    };

    service['heroes'] = [updatedHero]; // Directly assigning heroes for testing purpose
    service.updateHero(updatedHero).subscribe(hero => {
      expect(hero).toEqual(updatedHero);
    });
  });

  it('should delete a hero by id', () => {
    const hero: Hero = {
      id: '1',
      superhero: 'Superman',
      publisher: Publisher.DCComics,
      alter_ego: 'Clark Kent',
      first_appearance: 'Action Comics #1',
      characters: 'Clark Kent',
    };

    service['heroes'] = [hero]; // Directly assigning heroes for testing purpose
    service.deleteHeroById('1').subscribe(wasDeleted => {
      expect(wasDeleted).toBeTruthy();
      expect(service['heroes']).not.toContain(hero);
    });
  });
});
