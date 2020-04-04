class Currency {
    getAll()  {
        const list = [
            { name: 'British Pound', symbol: 'GBP', sign: '£', flagName: 'united-kingdom'},
            { name: 'US Dollar', symbol: 'USD', sign: '$', flagName: 'united-states-of-america'},
            { name: 'European Euro', symbol: 'EUR', sign: '€', flagName: 'canada'},
            { name: 'Nigerian Naira', symbol: 'NGN', sign: '₦', flagName: 'nigeria'},
            { name: 'UAE Dirham', symbol: 'AED', sign: '	د.إ', flagName: 'united-arab-emirates'},
            { name: 'Chinese Yuan', symbol: 'CNY', sign: '¥', flagName: 'china'}
        ]
        return list;
    }
    getOne(symbol) {
        const cunList = this.getAll()
        const cunIndex = cunList.findIndex(cun => cun.symbol === symbol)
        if(cunIndex >= 0) {
          return cunList[cunIndex] 
        } else {
            console.log('currcny does not exist');
            return false
        }
    }
}

export default new Currency;