
let restrictionEnabled = false;

export function enableDevToolsRestriction(): void {
  // Avoid registering the same handlers multiple times.
  if (restrictionEnabled) {
    return;
  }

  restrictionEnabled = true;

  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const isF12 = event.key === 'F12';

      const isCtrlShiftShortcut =
        event.ctrlKey &&
        event.shiftKey &&
        ['i', 'j', 'c'].includes(key);

      const isViewSource =
        event.ctrlKey && key === 'u';

      const isMacShortcut =
        event.metaKey &&
        event.altKey &&
        ['i', 'j', 'c'].includes(key);

      if (
        isF12 ||
        isCtrlShiftShortcut ||
        isViewSource ||
        isMacShortcut
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  document.addEventListener(
    'contextmenu',
    (event: MouseEvent) => {
      event.preventDefault();
    },
    true
  );
}
