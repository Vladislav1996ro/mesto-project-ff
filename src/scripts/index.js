import "../pages/index.css";
import { buildCard, removeCard, toggleLike } from "./card.js";
import { openPopup, closePopup, closePopupOnOverlayClick } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialCards,
  getUserInformation,
  addNewCard,
  updateUserData,
  updateAvatar,
} from "./api.js";

const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const placesList = document.querySelector(".places__list");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const formElementProfile = document.querySelector('form[name="edit-profile"]');

const popupTypeImage = document.querySelector(".popup_type_image");
const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

const profileImage = document.querySelector(".profile__image");
const popupTypeEditAvatar = document.querySelector(".popup_type_edit-avatar");
const popupInputTypeAvatarUrl = document.querySelector(
  ".popup__input_type_avatar_url"
);
const formElementAvatar = document.querySelector('form[name="update-avatar"]');

const popupDeleteAgreement = document.querySelector(".popup_delete-agreement");
const formElementAgreement = document.querySelector('form[name="agreement"]');

let cardForDeleteElement;
let cardForDeleteId;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

profileImage.addEventListener("click", () => {
  popupInputTypeAvatarUrl.value = profileImage.style.backgroundImage.replace(
    /^url\(["']?|["']?\)$/g,
    ""
  );
  clearValidation(popupTypeEditAvatar, validationConfig);
  openPopup(popupTypeEditAvatar);
});

formElementAvatar.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);
  updateAvatar(popupInputTypeAvatarUrl.value.trim())
    .then((data) => {
      profileImage.style.backgroundImage = `url("${data.avatar}")`;
      formElementAvatar.reset();
      closePopup(popupTypeEditAvatar);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, submitButton));
});

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(popupTypeEdit, validationConfig);
  openPopup(popupTypeEdit);
});

profileAddButton.addEventListener("click", () => {
  formElementCard.reset();
  clearValidation(popupTypeNewCard, validationConfig);
  openPopup(popupTypeNewCard);
});

const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
  popup.addEventListener("click", closePopupOnOverlayClick);
});

formElementProfile.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);
  updateUserData(nameInput.value, jobInput.value)
    .then(() => {
      profileTitle.textContent = nameInput.value;
      profileDescription.textContent = jobInput.value;
      formElementProfile.reset();
      closePopup(popupTypeEdit);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, submitButton));
});

const formElementCard = document.querySelector('form[name="new-place"]');
const inputCardName = document.querySelector(".popup__input_type_card-name");
const inputCardUrl = document.querySelector(".popup__input_type_url");

function handleCardFormSubmit(evt, userId) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);
  addNewCard(inputCardName.value, inputCardUrl.value)
    .then((newCardData) => {
      const newCard = buildCard(
        newCardData,
        handleDeleteButtonClick,
        handleCardImageClick,
        toggleLike,
        userId
      );
      placesList.prepend(newCard);
      formElementCard.reset();
      closePopup(popupTypeNewCard);
    })
    .catch(console.error)
    .finally(() => renderLoading(false, submitButton));
}

function renderLoading(isLoading, button) {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
}

formElementAgreement.addEventListener("submit", handleRemoveCardSubmit);

function handleRemoveCardSubmit(evt) {
  evt.preventDefault();
  removeCard(cardForDeleteElement, cardForDeleteId, () =>
    closePopup(popupDeleteAgreement)
  );
}

function handleDeleteButtonClick(cardId, cardElement) {
  cardForDeleteElement = cardElement;
  cardForDeleteId = cardId;
  openPopup(popupDeleteAgreement);
}

Promise.all([getUserInformation(), getInitialCards()])
  .then(([userData, cardsData]) => {
    profileImage.style.backgroundImage = `url("${userData.avatar}")`;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    cardsData.forEach((cardData) => {
      const card = buildCard(
        cardData,
        handleDeleteButtonClick,
        handleCardImageClick,
        toggleLike,
        userData._id
      );
      placesList.append(card);
    });

    formElementCard.addEventListener("submit", (event) =>
      handleCardFormSubmit(event, userData._id)
    );
  })
  .catch(console.error);
