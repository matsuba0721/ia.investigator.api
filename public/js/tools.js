function accountChanged(account) {}

account = getLoginAccount();

window.onload = function () {
    $("#make-ccfolia-log").on("click", function () {
        var text = $("#ccfolia-log")[0].value.replace(/\r\n|\r/g, "\n");
        var lines = text.split("\n");
        var rolls = {};
        var excludeCommands = ["SAN", "クトゥルフ", "信用"];

        for (var i = 0; i < lines.length; i++) {
            if (lines[i] == "") continue;

            matches = lines[i].match(/\[.+\](.+):(.+)\(1D100.+\).+(ファンブル|失敗|レギュラー成功|ハード成功|イクストリーム成功|クリティカル)/);
            if (matches == null) continue;
            roll = {
                name: matches[1],
                command: matches[2].trimStart(),
                result: matches[3],
            };
            var isExclude = false;
            for (var j = 0; j < excludeCommands.length; j++) {
                if (roll.command.indexOf(excludeCommands[j]) > 0) {
                    isExclude = true;
                    break;
                }
            }
            if (isExclude) continue;
            if (!rolls[roll.name]) {
                rolls[roll.name] = {};
            }
            user = rolls[roll.name];
            if (!user[roll.command]) {
                user[roll.command] = {
                    fumble: false,
                    failure: false,
                    regularSuccess: false,
                    hardSuccess: false,
                    extremeSuccess: false,
                    critical: false,
                };
            }
            userCommand = user[roll.command];
            if (roll.result == "ファンブル") {
                userCommand.fumble = true;
            } else if (roll.result == "失敗") {
                userCommand.failure = true;
            } else if (roll.result == "レギュラー成功") {
                userCommand.regularSuccess = true;
            } else if (roll.result == "ハード成功") {
                userCommand.hardSuccess = true;
            } else if (roll.result == "イクストリーム成功") {
                userCommand.extremeSuccess = true;
            } else if (roll.result == "クリティカル") {
                userCommand.critical = true;
            }
        }
        var result = "";
        console.log(rolls);
        for (userName in rolls) {
            var userRoll = rolls[userName];
            var successSkills = "";
            var unsuccessSkills = "";
            var failureSkills = "";
            for (userCommandName in userRoll) {
                var userCommand = userRoll[userCommandName];
                if (userCommand.critical) {
                    successSkills += `${userCommandName}★クリティカル\n`;
                } else if (userCommand.extremeSuccess) {
                    successSkills += `${userCommandName}◎イクストリーム成功\n`;
                } else if (userCommand.hardSuccess) {
                    successSkills += `${userCommandName}○ハード成功\n`;
                } else if (userCommand.regularSuccess) {
                    successSkills += `${userCommandName}○レギュラー成功\n`;
                } else if (userCommand.fumble) {
                    unsuccessSkills += `${userCommandName}▲ファンブル\n`;
                } else if (userCommand.failure) {
                    unsuccessSkills += `${userCommandName}△失敗\n`;
                }

                if (userCommand.fumble) {
                    failureSkills += `${userCommandName}▲ファンブル\n`;
                } else if (userCommand.failure) {
                    failureSkills += `${userCommandName}△失敗\n`;
                }
            }
            result += `---${userName}---\n`;
            if ($("#make-ccfolia-log-success")[0].checked) {
                result += `❖成功技能❖\n`;
                result += successSkills;
            }
            if ($("#make-ccfolia-log-unsuccess")[0].checked) {
                result += `❖未成功技能❖\n`;
                result += unsuccessSkills;
            }
            if ($("#make-ccfolia-log-failure")[0].checked) {
                result += `❖失敗技能❖\n`;
                result += failureSkills;
            }
            result += `\n`;
        }

        $("#ccfolia-log-summary")[0].value = result;
    });

    $("#ccfolia-log-summary-copy").on("click", function () {
        writeClipboard($("#ccfolia-log-summary")[0].value);
    });

    initSigns();
    initAccount(account);
    $(".ui.dropdown").dropdown();
};
