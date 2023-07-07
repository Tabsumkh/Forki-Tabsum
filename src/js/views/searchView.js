class searchView {
    _parentEl = document.querySelector('.search')

    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value // search ma lekheko value
        this._clearInput()
        return query
    }  // SO yo function le data return garxa ani controller ma chei const query ma yo data hami store garxam.

    _clearInput() {
        this._parentEl.querySelector('.search__field').value = ''
    }
    addHandlerSearch(handler) { //publisher-subscriber method. This is a publisher.
        this._parentEl.addEventListener('submit', function (e) {  //siddhei handler() yei function ko satta call nagareko kina bhane, submit garda page reload hunxa
            e.preventDefault();
            handler();
        })
    }
}

export default new searchView(); 