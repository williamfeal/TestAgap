import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

/**
 * NewPageComponent handles the creation and updating of heroes.
 * It offers form controls to input hero details and uses the HeroesService for CRUD operations.
 */
@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  /**
   * Retrieves the current hero from the form values.
   */
  public get currentHero(): Hero {
    return this.heroForm.value as Hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) =>
          this.heroesService.getHeroById(id).pipe(
            tap(hero => {
              if (!hero) {
                throw new Error('Hero not found');
              }
            })
          )
        )
      ).subscribe({
        next: hero => {
          this.heroForm.reset(hero);
        },
        error: error => {
          console.error(error);
          this.router.navigateByUrl('/');
        }
      });

  }

  /**
   * Handles form submission. Updates or creates a hero based on form data.
   */
  public onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => this.showSnackbar(`${hero.superhero} Actualizad@!`));
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} Cread@!`);
      });
  }

  /**
   * Initiates the delete hero process.
   */
  public onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(() => this.router.navigate(['/heroes']));
  }

  /**
   * Displays a snackbar with the provided message.
   * @param message - The message to be displayed in the snackbar.
   */
  public showSnackbar(message: string): void {
    this.snackbar.open(message, 'Hecho', { duration: 2500 });
  }
}
