import icons from 'url:../../img/icons.svg';

//This is the main View parent class.
export default class View {  // yo pali hami instance export gardinam. We  will use it as a parent class of other Views.    
  _data;


  render(data, render = true) {  // controller.js ko recipeView.render(model.state.recipe) line ko model.state.recipe store bhayo yaha aaba _data ma .
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError() // If there is no data, or if there is data but that data is an array and it is empty. Yo sab condition check gareko. Search ma empty string halda feri dekhauna lai
    this._data = data;
    const markup = this._generateMarkup();

    // This will only return string and not insert anything anything.
    if (!render) return markup //  markup is inserted by the ORIGINAL render() method called on the bookmarksView in the controlAddBookmark function within controller.js

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);  //as a first child.


  }
  /*
   update(data) {
     if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError() // If there is no data, or if there is data but that data is an array and it is empty. Yo sab condition check gareko. Search ma empty string halda feri dekhauna lai
     this._data = data; //hamile update garisake paxi, we want the views data to become the new data.
     const newMarkup = this._generateMarkup(); // Yaha chei hamro view render hune sabbai markup hunxa. Hamile yaha garna chei update garna khojeko ho, tei ni hamilai entire markup kina chainxa bhane hamile old markup sanga compare garna lai ho
     // so yo update method ma chei hami k garxam bhanda , we create a new markup but not render it. instead, teslai hami virtual dom bhanera chinxam.
 
     const newDOM = document.createRange().createContextualFragment(newMarkup) //create range le chei it creates something called range. and under range we can call another method createContextualFragement . And this is  wehre we pass the string of markup.
     //createContextualFragment will convert that string markup into real dom node object . So yo mathi ko line le chei hamro markup lai virtual dom ma convert garidinxxa
     const newElements = Array.from(newDOM.querySelectorAll('*')); // YO bhaneko newly created virtual DOM
     const curElements = Array.from(this._parentElement.querySelectorAll('*')) // yo bhaneko hamisanga bhako DOM
     // console.log(curElements) //old dom => yesko array 13  => span.recipe__info-data.recipe__info-data--people bhitra innerHtml = 4 hunxa. Jun hamro webpage ma dekhirako xa
     // console.log(newElements) //new cirtual dom => yesko array 13 => span.recipe__info-data.recipe__info-data--people bhita innerHtml = 5 hunxa (since hamile + button thichim. - thicya bhaye 3 hutyo)
 
     newElements.forEach((newEl, i) => {
       const curEl = curElements[i]
       //console.log(curEl, newEl.isEqualNode(curEl)) //yesle chei compare garxa newEl ko [0] vs  curEl [0] milxa bhane true , farak xa bhane false fyalxa
 
 
       // Update changed Text
 
       if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {  //newElement ko node currElement sanga same xaina bhane and
         // newEl.firstChild?.nodeValue.trim() !== '' => bhaneko chei newEl.firstChild bhaneko chei tesle textNode bhanne selectgarxa. ani '?' le chei textNode xa ? herxa ani cha bhane nodeValue bata text ko value halxa. ani .trim() le chei white space clear garxa ani !== '' bhnaeko chei nodeValue empty string hunu hudaina bhaneko
         // So summary ma yo chei k gareko bhanda mathi, curEl sanga newEl ko data milena bhane ani namileko text only select garxam firstChild le . ani tespaxi tesko value linxam ra tyo value empty hunu hudainam bhanera bhanxam . Ani tyo sabbai condition satisfy bhayesi tala function ma chei currrent element ko value chei jj change bhayo tei set gardinxam.
 
 
         //console.log(newEl.firstChild.nodeValue.trim())  // yesle chei recipe ingridents ma badda wa ghattda store bhako number value store garxa
         curEl.textContent = newEl.textContent; // cururElement ko value updated data le bharinxa.
 
       } // so yo mathi ko funciton le chei recipe ingredients update huna thalisako. '+' or '-' ma click garda badeko ghateko dekhna sakinxa . 
 
 
 
 
       // Update changed Attributes
 
       if (!newEl.isEqualNode(curEl)) { //replacing all thee attributes in current elements with the attributes coming from the new elements
         //console.log(newEl.attributes) // mathi ko condition herera ya chei aba yesle it logs attribues of all the elements that has changed.
         // console.log(Array.from(newEl.attributes))
         Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))
 
       }
     })
 
 
 
 
   }
  */


  // Update algorithm without comments.



  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()   //


    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup)



    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]
      //console.log(curEl, newEl.isEqualNode(curEl))

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {

        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        //console.log(Array.from(newEl.attributes))
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))
      }
    })




  }


  _clear() {
    this._parentElement.innerHTML = '';

  }

  renderSpinner() { //public memthod so that controller can call the spinner as it starts fetching data.
    const markup = ` 
        <div class="spinner">  
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> `;


    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this._errorMessage) { //default ma user le kei halena bhane message ma yo dekhauxa.
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div> ` ;
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage(message = this._message) { //default ma user le kei halena bhane message ma yo dekhauxa.
    const markup = `
    <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`  ;
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}



/*





*/
