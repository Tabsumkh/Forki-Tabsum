import icons from 'url:../../img/icons.svg';
import View from './View.js';



class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');


  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {  // ek-ek button select garnu bahnda parent class lai nai select gareko (Event delegation)
      e.preventDefault()

      const btn = e.target.closest('.btn--inline')

      if (!btn) return // yo bhayena bhane chei btn bahira click garyo bhane error auxa btn find bhayena null ko data badlina sakdaina bhanera.

      const goTopage = +btn.dataset.goto; // btn forward ra btn backward ma data-goto bhanera dataset banako xu. Tesko value leko. Page - 6 click garyo bhane yesma 6 store hunxa ra agadi ko + le yeslai string dekhi number banaidinxa.

      handler(goTopage)
    })
  }


  _generateMarkup() {


    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage)  //kati ota page xa bahnera nikaleko. Results bhanneko kati ota data ayo bhanera dekhuaxa. 
    // Since ani results per page bhaneko ek page ma kati ota data rakhne bhanera dekhauxa. So 100 ota data chan ra ek page ma 10 ota matra data rakhna milxa bhane 100/10 = 10 pages nikaleko jastai ho.
    console.log(numPages)

    const curPage = this._data.page //current page.

    const btnForward = `<button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`


    const btnBackward = `<button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>`


    //Hami page 1 ma xam ra there are other pages 
    if (curPage === 1 && numPages > 1) {
      return btnForward
    }


    //Last page 
    if (curPage === numPages && numPages > 1) {
      return btnBackward
    }
    //other page

    if (curPage < numPages) {
      return btnForward + btnBackward
    }

    //Hami page 1 ma xam ra there are no other pages.
    return ''
  }


}


export default new PaginationView(); 