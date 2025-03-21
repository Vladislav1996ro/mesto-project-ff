export function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeOnEscape);
}

export function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
}

export function closeOnEscape(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export function closePopupOnOverlayClick(event) {
  if (event.target.classList.contains("popup")) {
    closePopup(event.target);
  }
}

// Инициализация обработчиков закрытия попапов
const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  const closeButton = popup.querySelector(".popup__close");
  if (closeButton) {
    closeButton.addEventListener("click", () => closePopup(popup));
  }
  popup.addEventListener("click", closePopupOnOverlayClick);
});
