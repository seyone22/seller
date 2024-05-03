function currencyFormatter(currency, sign) {
    if (currency == undefined) {
        currency = 0
    }
    const sansDec = currency.toFixed(2);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
}

export default currencyFormatter;