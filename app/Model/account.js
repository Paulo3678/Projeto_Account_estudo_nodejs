module.exports = class Account {

    constructor() {
        this.__balance = 0;
        this.__accountName = null;
    }

    setBalance(value) {
        this.__balance += value;
    }

    withdraw(withdrawValue){
        this.__balance -= withdrawValue;
    }

    get balance() {
        return this.__balance;
    }

    setAccountName(accountName) {
        this.__accountName = accountName;
    }

    get accountName() {
        return this.__accountName;
    }
}
