const bank = require('../Model/account.js');
const inquirer = require('inquirer');
const accountHelper = require('../Services/account_helper.js');
const messageMaker = require('../Services/message_maker.js');
const fs = require('fs');
const Account = require('./../Model/account.js');
const { successMessage } = require('../Services/message_maker.js');


class BankController {


    // Application main
    init() {
        inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "O que você deseja fazer?",
                choices: [
                    'Criar conta',
                    'Consultar saldo',
                    'Depositar',
                    'Sacar',
                    'Transferir',
                    'Sair'
                ]
            }
        ]).then((answer) => {

            if (answer['action'] === "Criar conta") {
                return this.makeNewAccount();
            } else if (answer['action'] === "Consultar saldo") {
                return this.checkBalance();
            } else if (answer['action'] === "Depositar") {
                return this.deposit();
            } else if (answer['action'] === "Sacar") {
                return this.withdraw();
            } else if (answer['action'] === "Transferir") {
                return this.transfer();
            } else if (answer['action'] === "Sair") {
                this.exit();
            }

        }).catch(err => console.log(err));
    }

    // Make new account
    makeNewAccount() {
        inquirer.prompt([
            {
                name: "accountName",
                message: "Digite um nome para sua conta:"
            }
        ]).then((answer) => {
            if (accountHelper.accountExists(answer["accountName"])) {
                messageMaker.errorMessage(`A conta ${answer["accountName"]} já existe!`);
                return this.init();
            }
            const accountName = answer['accountName']

            const account = new Account();
            account.setAccountName(accountName);

            accountHelper.saveAccount(account.accountName, account.balance);
            return this.init();

        }).catch(err => console.log(err));
    }

    // Get account balance
    checkBalance() {
        inquirer.prompt([
            {
                name: "accountName",
                message: "Digite o nome da sua conta:"
            }
        ]).then((answer) => {

            if (!accountHelper.accountExists(answer["accountName"])) {
                messageMaker.errorMessage(`A conta ${answer["accountName"]} não existe!`);
                return this.init();
            }

            const accountName = answer["accountName"];
            const account = accountHelper.getAccount(accountName);

            messageMaker.successMessage(`O saldo da conta ${account.accountName} é de R$${account.balance}`);

            return this.init();

        }).catch(err => console.log(err));
    }

    // To deposit a value in a valid account
    deposit() {
        inquirer.prompt([
            {
                name: 'accountName',
                message: 'Digite o nome da sua conta:'
            }
        ]).then((answer) => {
            if (!accountHelper.accountExists(answer["accountName"])) {
                messageMaker.errorMessage(`A conta ${answer["accountName"]} não existe!`);
                return this.init();
            }

            const accountName = answer["accountName"];
            const account = accountHelper.getAccount(accountName);

            inquirer.prompt([
                {
                    name: "balanceValue",
                    message: "Digite o valor do depósito:"
                }
            ]).then((answer) => {

                if (!answer['balanceValue']) {
                    messageMaker.errorMessage("Ops... O valor digitado é inválido, por favor tente novamente!");
                    return this.deposit;
                }

                const balanceValue = answer['balanceValue'];
                account.setBalance(parseFloat(balanceValue));

                accountHelper.saveAccountUpdates(account);
                messageMaker.successMessage("Depósito realizado com sucesso!");

                return this.init();
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));

    }

    // to withdraw a value
    withdraw() {
        inquirer.prompt([
            {
                name: "accountName",
                message: "Digite o nome da sua conta:"
            }
        ]).then((answer) => {
            if (!accountHelper.accountExists(answer["accountName"])) {
                messageMaker.errorMessage(`A conta ${answer["accountName"]} não existe!`);
                return this.init();
            }
            const accountName = answer["accountName"];

            inquirer.prompt([
                {
                    name: "withdrawValue",
                    message: "Digite o valor do saque:"
                }
            ]).then((answer) => {
                if (!answer["withdrawValue"]) {
                    messageMaker.errorMessage("O valor digitado não é valido!");
                    return this.withdraw();
                }
                const withdrawValue = parseFloat(answer["withdrawValue"]);
                const account = accountHelper.getAccount(accountName);

                if (withdrawValue > account.balance) {
                    messageMaker.errorMessage(`Não há saldo suficiente para sacar R$${withdrawValue.toFixed(2)}`)
                    return this.withdraw();
                }

                account.withdraw(withdrawValue);
                accountHelper.saveAccountUpdates(account);

                messageMaker.successMessage(`Saque realizado com sucesso! Valor sacado R$${withdrawValue.toFixed(2)}`);
                return this.init();

            }).catch(err => console.log(err));



        }).catch(err => console.log(err));
    }

    // to transfer a value from account x to account y
    transfer() {
        inquirer.prompt([
            {
                name: "accountName",
                message: "Digite o nome da sua conta:"
            }
        ]).then((answer) => {
            if (!accountHelper.accountExists(answer["accountName"])) {
                messageMaker.errorMessage(`A conta "${answer["accountName"]}" não existe`);
                return this.init();
            }
            const accountName = answer["accountName"];
            const account = accountHelper.getAccount(accountName);

            inquirer.prompt([
                {
                    name: "transferValue",
                    message: "Digite o valor que será transferido:"
                }
            ]).then((answer) => {
                if (!answer["transferValue"] || account.balance < answer["transferValue"]) {
                    messageMaker.errorMessage(`O valor de transferência é inválido!`);
                    return this.init();
                }
                const transferValue = answer["transferValue"];

                inquirer.prompt([
                    {
                        name: "accountToTransfer",
                        message: "Para qual conta deseja transferir?"
                    }
                ]).then((answer) => {
                    if (!accountHelper.accountExists(answer["accountToTransfer"])) {
                        messageMaker.errorMessage(`A conta "${answer["accountToTransfer"]}" não existe!`);
                        return this.init();
                    }

                    const accountToTransfer = accountHelper.getAccount(answer["accountToTransfer"]);

                    account.withdraw(parseFloat(transferValue));
                    accountToTransfer.setBalance(parseFloat(transferValue));

                    accountHelper.saveAccountUpdates(account);
                    accountHelper.saveAccountUpdates(accountToTransfer);

                    messageMaker.successMessage(`Transferência feita com sucesso! O valor R$${parseFloat(transferValue).toFixed(2)} foi enviado para conta ${accountToTransfer.accountName}`)

                    return this.init();

                }).catch(err => console.log(err));

            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
    }

    // To quit from app
    exit(){
        process.exit();
    }

}


module.exports = new BankController();