export function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeOnEscape);
  popupElement.querySelectorAll(".popup__close").forEach((button) => {
    button.addEventListener("click", closeOnButton);
  });
}

export function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
  popupElement.querySelectorAll(".popup__close").forEach((button) => {
    button.removeEventListener("click", closeOnButton);
  });
}

export function closeOnEscape(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export function closeOnButton() {
  const openedPopup = document.querySelector(".popup_is-opened");
  if (openedPopup) {
    closePopup(openedPopup);
  }
}

export function closePopupOnOverlayClick(event) {
  if (event.target.classList.contains("popup")) {
    closePopup(event.target);
  }
}
