
import View from './View.js';

import icons from 'url:../../img/icons.svg';

// So yo preview le chei will only genarate markup for <preview> element.



class PreviewView extends View {
  _parentElement = `` // parent elemnt chaidaina



  _generateMarkup() {

    const id = window.location.hash.slice(1)


    return `<li class="preview">
      <a class="preview__link ${this._data.id === id ? `preview__link--active` : ''}" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
          </div>
        </div>
        
      </a>
    </li>`
  }
}

export default new PreviewView() // Exporting instance means there can only be one ResultsView. Class nai export gareko bhaye naya instance create garirana miltyo. (Confuse nahunu, just a note.)