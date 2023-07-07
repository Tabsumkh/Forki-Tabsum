import icons from 'url:../../img/icons.svg';
import View from './View.js';



class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `Sorry, We couldn't find the item you are searching for. Please try another item.`
  _message = ''


  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings')
      if (!btn) return //btn bahira click garda null dekhauxa so to prevent that we do this.
      // console.log(btn)
      const updateTo = +btn.dataset.updateTo   //btn.dataset.update-to ko satta updateTo xa kina bhane ( data-update-to lai hami dataset.updateTo yesari camelCase ma lekhxam)  update-to ko minus lai hatayera updateTo lekhxam. Rule ho yo dataset dekhi data lyauda.

      if (updateTo > 0) handler(updateTo) // -1, -2 values haru halna namilos bahnera. So aba minus icon click garda garda 1 mai stop hunxa.1 bhanda tala jadaina.

    })
  }

  // subscriber publiser pattern. (Publisher)
  addHandler(handler) { // ya chei controller ko control recipe function hunxa.Siddei controlRecipe function import nagareko kina ki it is controller. And MVC ko anusar view lai controller bhako tha ni hunuhunna.
    ['hashchange', 'load'].forEach(x => window.addEventListener(x, handler)) //load chei windows load huna sath yo showRecipe run hunxa.
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark')

      if (!btn) return
      handler()
    })
  }

  _generateMarkup() {
    return `  <figure class="recipe__fig"> 
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>    
    
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
          <span class="recipe__info-text">${this._data.servings === 1 ? 'serving' : 'servings'}</span>
    
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings"  data-update-to="${this._data.servings + 1}">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
              <button class="btn--round btn--bookmark">
                <svg class="">
                  <use href="${icons}#icon-bookmark${this._data.bookmarked ?
        '-fill' : ''}"></use>
                </svg>
              </button>
            </div>
    
            <div class="recipe__ingredients">
              <h2 class="heading--2">Recipe ingredients</h2>
              <ul class="recipe__ingredient-list">
                ${this._data.ingredients.map(ing => {

          return `
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${ing.quantity ? ing.quantity : ''}</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ing.unit}</span>
              ${ing.description}
            </div>
          </li>
    
        
        `
        }).join('')}
            </div>
    
            <div class="recipe__directions">
              <h2 class="heading--2">How to cook it</h2>
              <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
                directions at their website.
              </p>
              <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
              >
                <span>Directions</span>
                <svg class="search__icon">
                  <use href="src/img/icons.svg#icon-arrow-right"></use>
                </svg>
              </a>
            </div>
    `

  }
};

export default new RecipeView(); // creating new instance and exporting.  


//export default recipeView;  matra gareko bhaye uta controller ma import garisakepaxi yesai pani const recipeView = new RecipeView() garnai parthyo .