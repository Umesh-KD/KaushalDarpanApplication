
let restrictionEnabled = false;

const minimalUserResponseInMilliseconds = 200;
const devToolsCheckInterval = 100;

function notRunDevToolCheck(): void {
  const before = Date.now();

  debugger; // May pause execution when DevTools is open.

  const after = Date.now();

  if (after - before > minimalUserResponseInMilliseconds) {
    console.clear();
    document.body.textContent = "Please close Developer Tools.";

    window.location.replace(window.location.href);
    return;
  }

  window.setTimeout(
    notRunDevToolCheck,
    devToolsCheckInterval
  );
}

function disabledEvent(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
}

function notRunDevToolCheckOnLoad(): void {
  document.addEventListener(
    "contextmenu",
    (event: MouseEvent) => {
      disabledEvent(event);
    },
    false
  );

  document.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      const isMac = /mac/i.test(navigator.platform);

      const isDevToolsShortcut =
        (event.ctrlKey &&
          event.shiftKey &&
          ["i", "j", "c"].includes(key)) ||
        (isMac &&
          event.metaKey &&
          event.altKey &&
          ["i", "j", "c"].includes(key));

      const isSaveShortcut =
        key === "s" && (isMac ? event.metaKey : event.ctrlKey);

      const isViewSourceShortcut =
        key === "u" && event.ctrlKey;

      const isF12 = key === "f12";

      if (
        isDevToolsShortcut ||
        isSaveShortcut ||
        isViewSourceShortcut ||
        isF12
      ) {
        disabledEvent(event);
      }
    },
    true
  );
}

export function enableDevToolsRestriction(): void {
  if (restrictionEnabled) return;

  restrictionEnabled = true;

  console.clear();

  notRunDevToolCheckOnLoad();

  notRunDevToolCheck();
}
