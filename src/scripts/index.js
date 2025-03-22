import "../pages/index.css";
import { buildCard, removeCard, toggleLike } from "./card.js";
import {
  openPopup,
  closePopup,
  closePopupOnOverlayClick,
  initPopupListeners,
} from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialCards,
  getUserInformation,
  addNewCard,
  updateUserData,
  updateAvatar,
  deleteCard,
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

profileImage.addEventListener("click", function () {
  popupInputTypeAvatarUrl.value = profileImage.style.backgroundImage.replace(
    /^url\(["']?|["']?\)$/g,
    ""
  );
  clearValidation(popupTypeEditAvatar, validationConfig);
  openPopup(popupTypeEditAvatar);
});

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const button = evt.submitter;
  renderLoading(true, button);
  const avatarUrl = popupInputTypeAvatarUrl.value.trim();

  updateAvatar(avatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url("${data.avatar}")`;
      formElementAvatar.reset();
      closePopup(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, button);
    });
}

formElementAvatar.addEventListener("submit", handleAvatarFormSubmit);

const profileEditButton = document.querySelector(".profile__edit-button");
profileEditButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(popupTypeEdit, validationConfig);
  openPopup(popupTypeEdit);
});

const profileAddButton = document.querySelector(".profile__add-button");
profileAddButton.addEventListener("click", function () {
  clearValidation(popupTypeNewCard, validationConfig);
  openPopup(popupTypeNewCard);
});

const popups = document.querySelectorAll(".popup");
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
  popup.addEventListener("click", closePopupOnOverlayClick);
});

initPopupListeners();

enableValidation(validationConfig);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const button = evt.submitter;
  renderLoading(true, button);
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  updateUserData(nameValue, jobValue)
    .then(() => {
      profileTitle.textContent = nameValue;
      profileDescription.textContent = jobValue;
      formElementProfile.reset();
      closePopup(popupTypeEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, button);
    });
}

formElementProfile.addEventListener("submit", handleProfileFormSubmit);

const formElementCard = document.querySelector('form[name="new-place"]');
const inputCardName = document.querySelector(".popup__input_type_card-name");
const inputCardUrl = document.querySelector(".popup__input_type_url");

function handleCardFormSubmit(evt, userId) {
  evt.preventDefault();
  const button = evt.submitter;
  renderLoading(true, button);
  const cardNameValue = inputCardName.value;
  const cardUrlValue = inputCardUrl.value;

  addNewCard(cardNameValue, cardUrlValue)
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
      closePopup(evt.target.closest(".popup"));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, button);
    });
}

function handleCardImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(popupTypeImage);
}

Promise.all([getUserInformation(), getInitialCards()])
  .then(([userData, cards]) => {
    profileImage.style.backgroundImage = `url("${userData.avatar}")`;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    cards.forEach((cardData) => {
      const card = buildCard(
        cardData,
        handleDeleteButtonClick,
        handleCardImageClick,
        toggleLike,
        userData._id
      );
      placesList.append(card);
    });

    formElementCard.addEventListener("submit", (event) => {
      handleCardFormSubmit(event, userData._id);
    });
  })
  .catch((err) => {
    console.log(err);
  });

formElementAgreement.addEventListener("submit", handleRemoveCardSubmit);

function handleRemoveCardSubmit(evt) {
  evt.preventDefault();
  if (!cardForDeleteId || !cardForDeleteElement) {
    console.log("Ошибка: не задана карта для удаления");
    return;
  }
  removeCard(cardForDeleteElement, cardForDeleteId, () => {
    closePopup(popupDeleteAgreement);
  });
}

function handleDeleteButtonClick(cardId, cardElement) {
  cardForDeleteElement = cardElement;
  cardForDeleteId = cardId;
  openPopup(popupDeleteAgreement);
}

const renderLoading = (isLoading, buttonElement) => {
  if (!buttonElement) return;
  buttonElement.textContent = isLoading ? "Сохранение..." : "Сохранить";
};
