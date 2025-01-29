const placesList = document.querySelector(".places__list");

function buildCard(cardData, cardRemover) {
  const cardTemplate = document.querySelector("#card-template").content;

  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const imageElement = cardElement.querySelector(".card__image");
  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;

  const cardTitleElement = cardElement.querySelector(".card__title");
  cardTitleElement.textContent = cardData.name;
  const resetButton = cardElement.querySelector(".card__delete-button");

  resetButton.addEventListener("click", () => {
    cardRemover(cardElement);
  });

  return cardElement;
}

function removeCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach((cardData) => {
  const card = buildCard(cardData, removeCard);
  placesList.append(card);
});
