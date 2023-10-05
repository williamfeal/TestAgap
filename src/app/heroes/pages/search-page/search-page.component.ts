import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';

import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent implements OnInit, OnDestroy {

  public searchInput: FormControl = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  private subscription: Subscription = new Subscription();

  /**
   * Constructor for the SearchPageComponent.
   * @param heroesService - Service for managing hero data.
   * @param router - Service for navigating between routes.
   */
  constructor(
    public heroesService: HeroesService,
    public router: Router
  ) { }

  /**
   * Angular lifecycle method called on component initialization.
   */
  ngOnInit(): void { }

  /**
   * Fetches hero suggestions based on user input.
   */
  public searchHero(): void {
    const value: string = this.searchInput.value || '';
    const sub = this.heroesService.getSuggestions(value)
      .subscribe({
        next: heroes => this.heroes = heroes,
        error: error => console.error('Error fetching heroes:', error)
      });
    this.subscription.add(sub);
  }

  /**
   * Handles selection of a hero from the autocomplete dropdown.
   * @param event - The selection event from MatAutocomplete.
   */
  public onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;
    this.router.navigate(['/heroes', hero.id]);
  }

  /**
   * Angular lifecycle method called when the component is destroyed.
   * Used for cleanup purposes.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
