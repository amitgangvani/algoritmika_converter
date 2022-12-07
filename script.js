let base = ''
let symbols = ''
let rates = {}

const fromAmount = document.getElementById('fromAmount')
const toAmount = document.getElementById('toAmount')

const fromRates = document.querySelectorAll('.fromRates a')
const toRates = document.querySelectorAll('.toRates a')

const fromRate = document.getElementById('fromRate')
const toRate = document.getElementById('toRate')

const getRates = async () => {

    let response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`)
    let data = await response.json();
    rates = data.rates;

    toAmount.value = fromAmount.value * rates[symbols]
    fromRate.innerText = `1 ${base} = ${rates[symbols]} ${symbols}`
    toRate.innerText = `1 ${symbols} = ${1/rates[symbols]} ${base}`

}

fromAmount.addEventListener('input', (e) => {

    let incomingValue = beautifyString(e.target.value)
    fromAmount.value = incomingValue

    let newValue = Number(incomingValue * rates[symbols]).toFixed(4)

    toAmount.value = newValue

    if (!fromAmount.value) {
        toAmount.value = null
    }

})


toAmount.addEventListener('input', (e) => {

    let incomingValue = beautifyString(e.target.value)
    toAmount.value = incomingValue

    let newValue = Number(incomingValue / rates[symbols]).toFixed(4)

    fromAmount.value = newValue
    if (!toAmount.value) {
        fromAmount.value = null
    }

})


const beautifyString = (str) => {

    str = str.replace(/[^,\.\d]/g,'')
    str = str.replace(/,/g,'.')
    if(str === '.'){
        str = '0.'
    }
    let numberOfDots = str.split('.').length-1
    if (numberOfDots > 1){
        str = str.slice(0,length-1)
    }
    if(str[0] === '0' && str.length > 1 && str[1] !== '.'){
        str = str.slice(1,length)
    }

    return str

}


fromRates.forEach((rate) => {
    if (rate.classList.contains('selected')) {
        base = rate.textContent
        getRates()
    }
    rate.addEventListener('click', (e) => {
        let current = document.querySelector(".fromRates .selected");
        current.classList.remove("selected");
        rate.classList.add('selected')
        base = rate.textContent
        getRates()
    })
})

toRates.forEach((rate) => {
    if (rate.classList.contains('selected')) {
        symbols = rate.textContent
        getRates()
    }
    rate.addEventListener('click', (e) => {
        let current = document.querySelector(".toRates .selected");
        current.classList.remove("selected");
        rate.classList.add('selected')
        symbols = rate.textContent
        getRates()
    })
})

getRates()