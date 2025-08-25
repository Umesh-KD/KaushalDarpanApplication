import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private updates: SwUpdate) {
    if (this.updates.isEnabled) {
      // Periodic check
      setInterval(() => {
        this.updates.checkForUpdate();
      }, 6 * 60 * 60 * 1000); // every 6 hours

      // Listen for version ready event
      this.updates.versionUpdates
        .pipe(
          filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
        )
        .subscribe(() => {
          const doUpdate = confirm('A new version is available. Load the new version?');
          if (doUpdate) {
            this.updates.activateUpdate().then(() => document.location.reload());
          }
        });
    }
  }
}
