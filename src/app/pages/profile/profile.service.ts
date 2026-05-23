import { computed, inject, Injectable, signal } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { UserPrivate } from '../../core/api/models/user.types';
import { UsersApiService } from '../../core/api/users-api.service';
import { extractHttpErrorMessage } from '../../core/http/extract-http-error-message';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly usersApiService = inject(UsersApiService);
  private readonly userState = signal<UserPrivate | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly user = this.userState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly isEmpty = computed(
    () => !this.isLoading() && this.error() === null && this.user() === null,
  );

  loadProfile(): void {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.userState.set(null);

    this.usersApiService
      .getMe()
      .pipe(
        catchError((error: unknown) => {
          this.errorState.set(extractHttpErrorMessage(error, 'Impossibile caricare il profilo.'));
          return EMPTY;
        }),
        finalize(() => {
          this.loadingState.set(false);
        }),
      )
      .subscribe((user) => {
        this.userState.set(user);
      });
  }
}
