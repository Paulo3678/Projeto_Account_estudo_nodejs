const chalk = require('chalk');


class MessageMaker {

    successMessage(message) {
        console.log(chalk.green(message));
    }

    errorMessage(message) {
        console.log(chalk.bgRed.black(message));
    }

}
module.exports = new MessageMaker();
