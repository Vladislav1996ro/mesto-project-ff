let escapeListenerAdded = false;

export function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened");
  if (!escapeListenerAdded) {
    document.addEventListener("keydown", closeOnEscape);
    escapeListenerAdded = true;
  }
}

export function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  if (
    document.querySelectorAll(".popup_is-opened").length === 0 &&
    escapeListenerAdded
  ) {
    document.removeEventListener("keydown", closeOnEscape);
    escapeListenerAdded = false;
  }
}

function closeOnEscape(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

function closeOnButton(evt) {
  const popup = evt.target.closest(".popup");
  if (popup) {
    closePopup(popup);
  }
}

export function closePopupOnOverlayClick(event) {
  if (event.target.classList.contains("popup")) {
    closePopup(event.target);
  }
}

export function initPopupListeners() {
  const closeButtons = document.querySelectorAll(".popup__close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeOnButton);
  });
}
