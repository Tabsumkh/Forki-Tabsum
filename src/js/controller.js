/* 
Setting up ! 

Sab bhanda suru ma => npm init to create package.json 
Tespaxi package.json ma jane "main:" banne baneko hunxa tyo delete hanne 
Tespaxi "test" bhanne lai "start" : parcel index.html  lekhya xu. Setting parcel location 
"build" :parcel build index.html  

tespaxi command line ma : npm i parcel@2.0.0 -D 
ani tyo install bhayesi npm i sass 
ani finaly npm start 
tyo garda error ayo bhane package.json ma devdependencies bhanne nabaneko ni huna sakxa jun mero case ma bhayo. SO tyo solve garna , arko package - lock json bata devdependincies copy paste gardiye maile ra chalyo. 



NOTE :  

Hamile develope garirahane kura haru jasto index html controller js haru ma code lekhda hami yo src folder bhitra lekhirako xam bhane, 
browser ma chei tyo dist folder dekhi janxa! 
*/

//import icons from '../img/icons.svg'; //parcel 1 ma 


import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';


//console.log(icons) //icons bhaneko its nothing than just a location. So yesle chei bts ma icon ko page kholxa ani #icon-clock lekya xa bhane tyo code ko icon khojera haldinxa teti ho. 


// //hot module replacement bhanxa yo tala ko code lai
// if (module.hot) {  //yo chei parcel dekhi auxa hai, not actual js .    
//   module.hot.accept()
// }

// for example yo mathi ko code le chei half reload garxa. Jastai maile search ma pizza thiche re ani search gare. Pizza dekhauxa hai. Ani code ma ayera maile siddei ctrl + s matra
// thiche bhane pani tyo developing page ta reload hunxa.Ra hamro dekhako data harauxa ra hamile feri search ma gayera pizza thichnu parxa pizza dekhuna lai.
// but Hot module replacement , tyo mathi ko code le chei save garda ni page full reload hudaina, afulai chaiyeko change dekhinxa ra sabbai reset pani hudaina.


// https://forkify-api.herokuapp.com/v2



const controlRecipes = async function () {     // Api bata data leko .
  try {
    const id = window.location.hash.slice(1)


    if (!id) return
    recipeView.renderSpinner()


    // Update results view to mark selected search result
    resultView.update(model.getSearchResultPage()) // tei selected highlight gareko dekhauna lai hami update functio usegarxam

    // Updating the bookmarks view
    bookmarksView.update(model.state.bookmarks)

    //---------------------------
    //Loading the recipe 
    //---------------------------

    await model.loadRecipe(id) //returns promise as loadRecipe is async function thus await use gareko. 
    // model.loadRecipe le kei return gardaina ni ta so that we are not storing it into any variable. Instead yahacehii
    //we will get acess to state.recipe from model.js

    // SUMMARY ! -> Aile samma k bhairako xa bhanda await model.loadRecipe(id) code le chei recipeLoad hunxa ani state ma store garxa(model.js ko state objectma)
    // -> Yespaxi talako recipeView.render(model.state.recipe) ma chei hamile bharkhar jun data state ma halya thim tyo state lai hami import garxam mathii first line of code tira ani tya bata hami tyo recipe lai model dekhi controller ma tanera feri view ma render method banayera send garxam recipeView ko #data ma.


    //---------------------------
    //Rendering the recipe 
    //---------------------------

    recipeView.render(model.state.recipe) //render method recipeView ko class ma banako xa.
    //render method will now accept model.state.recipe a  nd now store it into RecipeView object from recipViewjs. (class)


  }
  catch (err) {
    recipeView.renderError()
  }
};




const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    // 1 Get Search Query
    const query = searchView.getQuery();
    if (!query) resultView.renderError();


    // 2 Load Search Resutts
    await model.loadSearchResults(query)


    // 3 Render Results

    // console.log(model.state.search.results)
    // resultView.render(model.state.search.results) // yo chei sabbai data dekhauna ko lagi
    resultView.render(model.getSearchResultPage()) // yo chei aileko lagi desired page dekhauna ko lagi

    //4 Render initial pagination buttons.

    paginationView.render(model.state.search) //yeti garesi view class ko data hunxa yo.


  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {

  // 1) Render new results
  resultView.render(model.getSearchResultPage(goToPage))

  // 2)Render new pagination buttons 

  paginationView.render(model.state.search)

}


const controlServings = function (newServings) {  // Yo chei users le servings button ma click garda execute hunxa

  // Update the recipe servings (in state)

  model.updateServings(newServings)

  // Update the recipe view 
  // recipeView.render(model.state.recipe) //feri recipeView re-render gareko kina bhane servings , recipe sab fernu parne xa
  recipeView.update(model.state.recipe)  // update method le chei only updates text and attributes in the DOM. View.js ma banako xu update method.


}

const controlAddBookmark = function () {


  // Add or remove bookmark

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)


  // Update recipe view

  recipeView.update(model.state.recipe) //updates only data that has changed.

  // Render bookmarks

  bookmarksView.render(model.state.bookmarks)
}


const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {

  try {

    //Show loading spinner
    addRecipeView.renderSpinner()

    //Upload the new recipe data

    await model.uploadRecipe(newRecipe) //upload Recipe async function ho atei bhayera await use gareko because it returns  promise.
    console.log(model.state.recipe)

    // Render Recipe 
    recipeView.render(model.state.recipe);

    // Success messgae 
    addRecipeView.renderMessage()

    // Close form window. 

    setTimeout(function () {
      addRecipeView.toggleWindow()
    }), MODAL_CLOSE_SEC * 1000  // converting to millisecond

    //Render bookmark view 

    bookmarksView.render(model.state.bookmarks) // not using update here kina bhane we want to insert a new element


    // Change id in the url 
    //History api use gareko hamile inbuilt to change url.
    window.history.pushState(null, '', `#${model.state.recipe.id}`) // Three arguement linxa , suru ko is state. second ko is title and last one is url itself
    //history object ma we can call pushState method. This will allow us to change the url without reloading a page.  So tya bhitra aile lai hamilai state null haldim kina ki matter gardain yo case ma ani title ni empty haldim kina ki matter gardaina. Ani last bhaneko url ho jun ma hami url ma halne id haldinxam 
    // window.history.back()  => yesle chei previous page reload garxa. We dont need it. Just note lekhirako lol.
  } catch (err) {
    console.error('🥲', err);
    addRecipeView.renderError(err.message)
  }
}


const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandler(controlRecipes)  // click haru handle gareko. 
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  console.log('hi')
  // controlServings()
}

init()

// window.addEventListener('hashchange', showRecipe)
// window.addEventListener('load', showRecipe)

