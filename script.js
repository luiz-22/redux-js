console.log(Redux) // Objeto Redux, lo obtengo por cdn

/***********************************************************************************************************/
/************************************************** TYPES **************************************************/
/***********************************************************************************************************/
// ------------------------------ wallet --------------------------------
const DEPOSIT = 'DEPOSIT'
const WITHDRAW = 'WITHDRAW'

// ---------------------------- to do list ------------------------------
const ADDTHING = 'ADDTHING'
const DONETHING = 'DONETHING'

// -------------------------------- api ---------------------------------
const GETAPI = 'GETAPI'


/***********************************************************************************************************/
/************************************************* ACTIONS *************************************************/
/***********************************************************************************************************/
// ------------------------------ wallet --------------------------------
const deposit = () => ({ type: DEPOSIT, payload: 10 })
const withdraw = () => ({ type: WITHDRAW, payload: 10 })

// ---------------------------- to do list ------------------------------
const addThing = (payload) => ({ type: ADDTHING, payload })
const doneThing = (payload) => ({ type: DONETHING, payload })


/***********************************************************************************************************/
/************************************************* REDUCER *************************************************/
/***********************************************************************************************************/
// ------------------------------ wallet --------------------------------
const initialWallet = 0

const reducerWallet = (state = initialWallet, action) => {
    switch (action.type) {
        case DEPOSIT:
            return state + action.payload;
        case WITHDRAW:
            return state - action.payload;
        default:
            return state;
    }
}

// ---------------------------- to do list ------------------------------
const initialToDoList = {
    toDo: [],
    done: []
}

const reducerToDoList = (state = initialToDoList, action) => {

    switch (action.type) {
        case ADDTHING:
            return ({
                ...state,
                toDo: [...state.toDo, action.payload]
            })

        case DONETHING:
            return ({
                ...state,
                toDo: state.toDo.filter((value, index) => index != action.payload),
                done: [...state.done, state.toDo[action.payload]]
            })

        default:
            return { ...state }
    }
}


const reducers = {
    wallet: reducerWallet,
    toDoList: reducerToDoList
}

const reducer = Redux.combineReducers(reducers)


/***********************************************************************************************************/
/************************************************** STORE **************************************************/
/***********************************************************************************************************/
const store = Redux.createStore(reducer) // instancia de Redux

console.log(store)


/***********************************************************************************************************/
/**************************************************** UI ***************************************************/
/***********************************************************************************************************/
const d = document
// ------------------------------ wallet --------------------------------
const $balance = d.getElementById('balance'),
    $deposit = d.getElementById('deposit'),
    $withdraw = d.getElementById('withdraw')


// subscribe
store.subscribe(() => {
    $balance.innerHTML = `$ ${store.getState().wallet}`
})

// dispatch
$deposit.addEventListener('click', () => {
    store.dispatch(deposit())
})

$withdraw.addEventListener('click', () => {
    store.dispatch(withdraw())
})

// ---------------------------- to do list ------------------------------
const $thing = d.getElementById('thing'),
    $addThing = d.getElementById('addThing'),
    $toDo = d.getElementById('toDo'),
    $done = d.getElementById('done')

// subscribe
store.subscribe(() => {
    $toDo.innerHTML = ''
    $done.innerHTML = ''
    $thing.value = ''

    let list1 = ''
    let list2 = ''

    store.getState().toDoList.toDo.forEach((el, i) => {
        list1 += `<li>${el} <button id="deleteThing" data-index="${i}">ready</button></li>`
    });

    store.getState().toDoList.done.forEach((el, i) => {
        list2 += `<li>${el} ✅</li>`
    });

    $toDo.innerHTML = list1
    $done.innerHTML = list2
})

// dispatch
$addThing.addEventListener('click', () => {
    if ($thing.value) {
        store.dispatch(addThing($thing.value))
    }
})

d.addEventListener('click', (e) => {
    if (e.target.matches('#deleteThing')) {
        let index = e.target.dataset.index
        store.dispatch(doneThing(index))
    }
})