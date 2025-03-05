export function toggleLike(event) {
  event.target.classList.toggle("card__like-button_is-active");
}

export function buildCard(
  cardData,
  handleCardDeleteButtonClick,
  handleCardImageClick,
  handleCardLikeButtonClick
) {
  const cardTemplate = document.querySelector("#card-template").content;

  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const imageElement = cardElement.querySelector(".card__image");
  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;

  imageElement.addEventListener("click", () => handleCardImageClick(cardData));

  const cardTitleElement = cardElement.querySelector(".card__title");
  cardTitleElement.textContent = cardData.name;

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", handleCardLikeButtonClick);

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    handleCardDeleteButtonClick(cardElement);
  });

  return cardElement;
}

export function removeCard(cardElement) {
  cardElement.remove();
}
