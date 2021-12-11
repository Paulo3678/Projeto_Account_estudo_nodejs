const fs = require('fs');
const messageMaker = require('./message_maker');
const Account = require("./../Model/account.js")

class AccountHelper {

    saveAccount(accountName, balance) {
        fs.writeFile(`./app/Data/${accountName}.json`, `{"accountName": "${accountName}", "balance": ${balance}}`, (err) => {
            return console.log(err);
        });

        messageMaker.successMessage(`Conta ${accountName} criada com sucesso! Obrigado por escolher o nosso banco 😊`)
    }

    accountExists(accountName) {
        if (fs.existsSync(`./app/Data/${accountName}.json`)) {
            return true;
        }
        return false;
    }

    getAccount(accountName) {
        const accountFile = JSON.parse(fs.readFileSync(`./app/Data/${accountName}.json`, {
            encoding: "utf-8",
            flag: "r"
        }));
        const account = new Account();

        account.setBalance(accountFile.balance);
        account.setAccountName(accountFile.accountName);
        return account;
    }

    saveAccountUpdates(account) {
        const update = `{"accountName": "${account.accountName}","balance": ${account.balance}}`;

        return fs.writeFile(`./app/Data/${account.accountName}.json`, update, (err) => console.log(err));
    }

}


module.exports = new AccountHelper();
