import { API_URL, RES_PER_PAGE, KEY } from './config.js' // api ko link. Since paxi future ma update anusar change huna sakxa, so hard code nagareko. 
//import { getJson, sendJSON } from './helpers.js'
import { AJAX } from './helpers.js'



export const state = {   //controlerjs ma use garna.
    recipe: {},
    search: {
        query: '', // paxi kei change garnu paryo bhane rakhirakheko. For future use. 
        results: [], //results is an array that contains entire search results.
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObject = function (data) {
    let { recipe } = data.data //destructuring! data.data.recipe ko value haleko recipe ma . Let kina ki maile tala recipe ko name haru change haneko xu. So const ma change hanna mildaina.
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key) && { key: recipe.key }  // short circuting => if recipe.key chei falsey value ho bhane , if it doesn;t exist than nothing happens. BHannu ko artha tyo destructuring le ni kei nai gardaina. But if it is actually some value than the second part is executed and returned. Hamro case ma chei  yo object return hunxa.{ key:recipe.key}  bhanne. Ani spread halesi chei tyo object harauxa. Anin key:recipe.key lekheko jasto hunxa same
        // Yo mathiko ek line chei  its a trick to conditionally adding properties to an object
    }
}

export const loadRecipe = async function (id) {  //responsible to load recipe from forkifyApi 

    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
        state.recipe = createRecipeObject(data)



        if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true
        else state.recipe.bookmarked = false
        // some le chei array ma loop hanxa ani euta le ni condition match hanyo bhane true return garxa. 
        // if there is any bookmark, that has a book mark id equal to the id that we jus recieved

    } catch (err) {
        console.error(`This is error => ${err}`)
        throw err; // ya mathi bhako same error hamile propagate gareko. Aba controller js ko catch ma yo error pakadna sakxam
    }

    console.log(state.recipe)


}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query //mathi state object ko query bbhaneko yo query ho bhaneko.
        //https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
        console.log(data)

        state.search.results = data.data.recipes.map(rec => {
            return {  // pizza search garda ayeko tannai object hraulai euta euta gardei name milako
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key) && { key: rec.key }
            }
        });

        state.search.page = 1; //reset handeko so that arko search ma page 1 dekhi nai suru hos.

    } catch (err) {
        console.error(`Yo ho loadSearchResult ko error ${err}`)
        throw err;
    }
}


export const getSearchResultPage = function (page = state.search.page) {  // This is not a async function because aile ko point samma result load bhaisakeeko hunxa. // Arko chei default value page ko haleko

    // We don't wanna hardcode it like this.
    // const start = 0
    // const end = 9
    // return state.search.results.slice(start, end)

    state.search.page = page

    const start = (page - 1) * state.search.resultsPerPage  //10 because hamilai 10 ota item chaiyeko xa euta page ma. Not more and not less.
    const end = page * state.search.resultsPerPage

    return state.search.results.slice(start, end)

    /*

    So hami function(page) ma 1 halxam. -> start = 1-1 = 0 * 10 = 0 nai hunxa. BHaneko hamro start ko value 0 basyo which is exactly what we want for our first page. 
    Ani end bhaneko hamro first page ko value 1 * 10 = 10 hunxa. Ra talako slice ma (0,10) halyo bhane 0-9 dekhauxa. Last ko number exclude hunxa slice ma taha xadai xa hamilai.

    same case ma function(page) ma aba 1 ko satta 2 halim bhane-> start = 2-1 * 10 = 10 hunxa second page. And that is exactly what we want. We want our second page to startdisplaying from 10th array.
    end = 2*10 = 20. Thus slice ma 10-20 halyo bhane(10 lai ni count garera) arko 10 ota array display garna milxa. Thus pagination ko funda done.
    */
}


export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {

        //newQuanity = oldQuantity *newServings/ old servings // 2*8 / 4 = 4     for 8 servings.

        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    })                  //.ingredients chei recipe api bata aune data mai xa

    state.recipe.servings = newServings
}


const presistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
    //Add bookmark 

    state.bookmarks.push(recipe)

    //Mark current recipe as bookmark 


    state.recipe.bookmarked = true //state.recipe ma new variable bookmarked banako with the value true.

    presistBookmarks()
}

export const deleteBookmark = function (id) {

    //Delete Bookmark
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1) //deleting the index from the array

    // Mark current recipe as not bookmared!
    if (id === state.recipe.id) state.recipe.bookmarked = false

    presistBookmarks()
}


const init = function () {
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage) //.parse le chei string lai feri object banaidinxa.
}
init()

// Yetikai dheraibook mark clear garna lai ekaixhoti. 
const clearBookmarks = function () {
    localStorage.clear('bookmarks')
}

// clearBookmarks() // call gareko xuina. Just in case chaiyo bhane call garna lai rakheko.


export const uploadRecipe = async function (newRecipe) {

    try {

        console.log(Object.entries(newRecipe))



        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
            const ingArr = ing[1].split(',').map(el => el.trim())

            const [quantity, unit, description] = ingArr
            //  return { quantity, unit, description } // respectively yo value basxa ['ingredient-1', '0.5,kg,Rice']
            if (ingArr.length !== 3) throw new Error('Wrong Ingredient format! Please use the correct Format.') // since hamile comma ma split garya xam, hamro length jaile 3 hunu parxa. Ra bhayena bhane error fyalxa
            return { quantity: quantity ? +quantity : null, unit, description } // quantity xa ? xa bhane number ma convert garidey xaina bhane null return gar.


        }) // Object.entires => object lai array ma convert gareko . addRecipeView.js module ma Object.fromEntries() gareko xa. Ra yo chei thyakka tesko ulto ho. Tesle array lai object banauxa bhane yesle object lai array banauxa.
        // mathi ko le chei suru ma object lai array ma halxa. Ani tespaxi filter le chei array ma bhako first data chei 'ingredient' dekhi suru hunu parxa ra second [1] data chei empty hunu hunna bhanxa. Yo condition match hune matra filter bhayera basxa.
        // tespaxi map lako, map bhitra destruct gareko. Ani ing[1].replaceAll le ing ko [1] ma bhako whitespace ' ' lai empty string le replace gardinxa '' ani split(',') le comma ko adhar ma split garauxa.



        const recipe = { // api ma data halna lai ready gareko. Suruma rename gareko thim, feri paila kei jasto name haleko api ko jasto name so taht api ma data halna sakinxa.
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,


        }
        console.log(recipe)


        const data = await AJAX(`${API_URL}?search=${recipe.title}&key=${KEY}`, recipe) // this will also send recipe back to us , so storing the data in variable. https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<insert your key> . Also sendJson has 2 parameter, euta url bhai go arko data ho. So tei bhayera recipe haleko second parameter
        state.recipe = createRecipeObject(data) // create object with the data that we just recieved
        addBookmark(state.recipe)
    } catch (err) {
        throw err; //throw err le error lai re-throw garxa so that it can propagate up the call stack.
    }


}