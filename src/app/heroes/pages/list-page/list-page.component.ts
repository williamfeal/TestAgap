import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

/**
 * ListPageComponent - This component displays a list of heroes.
 * It fetches the list from the HeroesService and renders them in the view.
 */
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: [
  ]
})
export class ListPageComponent implements OnInit {

  public heroes: Hero[] = [];

  /**
   * Constructor for ListPageComponent.
   * Initializes the HeroesService to be used in this component.
   *
   * @param heroesService - Service that provides methods related to heroes.
   */
  constructor( private heroesService: HeroesService ) {}

  /**
   * Used here to initialize the list of heroes by calling the HeroesService.
   */
  public ngOnInit(): void {

    this.heroesService.loadHeroesFromAssets().subscribe(() => {
      this.heroesService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
    });
  }

}
