import "../pages/index.css";
import { buildCard, removeCard, toggleLike } from "./card.js";
import { openPopup, closePopup, closePopupOnOverlayClick } from "./modal.js";
import { initialCards } from "./cards.js";
import { enableValidation } from "./validation.js";

const placesList = document.querySelector(".places__list");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const formElementProfile = document.querySelector('form[name="edit-profile"]');

const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

const profileEditButton = document.querySelector(".profile__edit-button");
profileEditButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});

const profileAddButton = document.querySelector(".profile__add-button");
profileAddButton.addEventListener("click", function () {
  openPopup(popupTypeNewCard);
});

const closeButtons = document.querySelectorAll(".popup__close");
closeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

document.addEventListener("click", closePopupOnOverlayClick);

const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;
  formElementProfile.reset();
  closePopup(evt.target.closest(".popup"));
}

formElementProfile.addEventListener("submit", handleProfileFormSubmit);

const formElementCard = document.querySelector('form[name="new-place"]');
const inputCardName = document.querySelector(".popup__input_type_card-name");
const inputCardUrl = document.querySelector(".popup__input_type_url");

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const cardNameValue = inputCardName.value;
  const cardUrlValue = inputCardUrl.value;

  const newCard = buildCard(
    {
      name: cardNameValue,
      link: cardUrlValue,
    },
    removeCard,
    handleCardImageClick,
    toggleLike
  );

  placesList.prepend(newCard);
  formElementCard.reset();
  closePopup(evt.target.closest(".popup"));
}

formElementCard.addEventListener("submit", handleCardFormSubmit);

function handleCardImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(popupTypeImage);
}

initialCards.forEach((cardData) => {
  const card = buildCard(
    cardData,
    removeCard,
    handleCardImageClick,
    toggleLike
  );
  placesList.append(card);
});

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

//включаем валидацию
enableValidation(validationConfig);
