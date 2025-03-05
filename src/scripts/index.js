import "../pages/index.css";
import { buildCard, removeCard, toggleLike } from "./card.js";
import { openPopup, closePopup } from "./modal.js";
import { initialCards } from "./cards.js";

// === Переменные ===
const placesList = document.querySelector(".places__list");

const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");

const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");

const formElementProfile = document.querySelector('form[name="edit-profile"]');
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const formElementCard = document.querySelector('form[name="new-place"]');
const inputCardName = document.querySelector(".popup__input_type_card-name");
const inputCardUrl = document.querySelector(".popup__input_type_url");

// === Функции ===
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupTypeEdit);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const newCard = buildCard(
    {
      name: inputCardName.value,
      link: inputCardUrl.value,
    },
    removeCard,
    handleCardImageClick,
    toggleLike
  );

  placesList.prepend(newCard);
  formElementCard.reset();
  closePopup(popupTypeNewCard);
}

function handleCardImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(popupTypeImage);
}

// === Добавление обработчиков ===
profileEditButton.addEventListener("click", function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});

profileAddButton.addEventListener("click", function () {
  openPopup(popupTypeNewCard);
});

const closeButtons = document.querySelectorAll(".popup__close");
closeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    closePopup(button.closest(".popup"));
  });
});

// Вешаем обработчик клика на оверлей только на попапы
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("click", function (evt) {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

formElementProfile.addEventListener("submit", handleProfileFormSubmit);
formElementCard.addEventListener("submit", handleCardFormSubmit);

// === Отрисовка карточек ===
initialCards.forEach((cardData) => {
  const card = buildCard(
    cardData,
    removeCard,
    handleCardImageClick,
    toggleLike
  );
  placesList.append(card);
});
