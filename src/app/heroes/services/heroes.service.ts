import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Hero } from '../interfaces/hero.interface';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private heroes: Hero[] = [];

  constructor(private http: HttpClient) { }

  /**
   * Loads heroes from the assets.
   * Returns cached heroes if available.
   */
  public loadHeroesFromAssets(): Observable<Hero[]> {
    if (this.heroes.length) {
      return of(this.heroes);
    }
    return this.http.get<{ heroes: Hero[] }>('assets/db.json').pipe(
      map(response => response.heroes),
      tap(heroes => this.heroes = heroes),
      catchError(error => {
        console.error('Error loading heroes from assets:', error);
        return of([]);
      })
    );
  }

  /**
   * Returns all available heroes.
   */
  public getHeroes(): Observable<Hero[]> {
    return of(this.heroes);
  }

  /**
   * Finds and returns a hero by its ID.
   */
  public getHeroById(id: string): Observable<Hero | undefined> {
    const hero = this.heroes.find(h => h.id === id);
    return of(hero);
  }

  /**
   * Provides hero suggestions based on a query string.
   */
  public getSuggestions(query: string): Observable<Hero[]> {
    const lowerCaseQuery = query.toLowerCase();
    const suggestedHeroes = this.heroes.filter(h => h.superhero.toLowerCase().includes(lowerCaseQuery));
    return of(suggestedHeroes);
  }

  /**
   * Adds a new hero to the list and returns it.
   */
  public addHero(hero: Hero): Observable<Hero> {
    hero.id = this.heroes.length.toString();
    this.heroes.push(hero);
    return of(hero);
  }

  /**
   * Updates the details of an existing hero.
   */
  public updateHero(updatedHero: Hero): Observable<Hero> {
    const index = this.heroes.findIndex(h => h.id === updatedHero.id);
    if (index !== -1) {
      this.heroes[index] = updatedHero;
      return of(updatedHero);
    }
    console.error('Hero not found:', updatedHero.id);
    return of(updatedHero);
  }

  /**
   * Deletes a hero by its ID and returns a boolean indicating success.
   */
  public deleteHeroById(id: string): Observable<boolean> {
    const initialLength = this.heroes.length;
    this.heroes = this.heroes.filter(h => h.id !== id);
    return of(initialLength > this.heroes.length);
  }
}
