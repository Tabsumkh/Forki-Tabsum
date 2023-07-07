import icons from 'url:../../img/icons.svg';
import View from './View.js';



class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload'); // whole form.
    _message = 'Recipe was successfuly uploaded '
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _btnOpen = document.querySelector('.nav__btn--add-recipe')
    _btnClose = document.querySelector('.btn--close-modal')

    constructor() {
        super(); //since yo child class ho we use super. Thus, only then we can now use 'this' keyword inside  constructor.
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden') // hidden class xa bhane halxa xaina bhane hatauxa
        this._window.classList.toggle('hidden')
    }
    _addHandlerShowWindow() { //recipe icon ma click garda

        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)) //this le current object lai point garxa. (Natra 'this' keyword yo function ma btnOpen hunthyo cause eventListener tesma attach bhako xa.)

    }

    _addHandlerHideWindow() { //close click garda
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
        this._overlay.addEventListener('click', this.toggleWindow.bind(this))


    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault()
            const dataArr = [...new FormData(this)] //<form class="upload"> bhitra ko values lai kasari lyaune ta bhanda
            // mathi ko data is the data that we want to upload in the API.
            /* 
            new FormData()  => Ya bhitra chei we need to pass a element that is a 'form'.
            - newFormData(this) => That form in this case is a 'this' keyword. Becaause we are inside of a handler function so const data ko 'this' points on  this.parentElement kina bhane tei ma eventHandler attached xa ra function call bhairakoxa. Ra parentElement bhanekai hamro upload form ho.\
            Aba  newFormData(this) will return a weird object jun hami use garna sakdainam. But, hami teslai spread gare paxi balla tesko data dekhinxa so hami spread garxam. [...new FormData(this)]
            And thus, this will give us an array  which contains all the fields with all the values in there.

            */
            console.log(dataArr) // => output => 0: ['title','TEST'] etc. where first one is the field and the second one is the value
            const data = Object.fromEntries(dataArr) //takes array of entries and convert them to objects.
            handler(data)
        })
    }

    _generateMarkup() {


    }


}


export default new AddRecipeView(); 