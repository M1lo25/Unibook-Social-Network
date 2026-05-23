import { Component, computed, inject, OnInit } from '@angular/core';

import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly profileService = inject(ProfileService);

  protected readonly profileUser = this.profileService.user;
  protected readonly isProfileLoading = this.profileService.isLoading;
  protected readonly profileError = this.profileService.error;
  protected readonly isProfileEmpty = this.profileService.isEmpty;
  protected readonly profileInitials = computed(() => {
    const user = this.profileUser();

    if (!user) {
      return '';
    }

    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  ngOnInit(): void {
    this.profileService.loadProfile();
  }

  protected reloadProfile(): void {
    this.profileService.loadProfile();
  }
}
