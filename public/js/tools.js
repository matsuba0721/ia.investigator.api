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

            matches = lines[i].match(/\[.+\](.+):(.+) (.+)\(1D100.+\).+＞ (.+)$/);
            if (matches == null) continue;
            roll = {
                name: matches[1],
                command: matches[2].trim().replace("CC-2","CC").replace("CC-1","CC").replace("CC1","CC").replace("CC2","CC").replace("h","").replace("e",""),
                tag: matches[3].trim(),
                result: matches[4],
                getKey: function(){return this.command + " " + this.tag;}
            };
            console.log(roll.result);
            var isExclude = false;
            for (var j = 0; j < excludeCommands.length; j++) {
                if (roll.tag.indexOf(excludeCommands[j]) > 0) {
                    isExclude = true;
                    break;
                }
            }
            if (isExclude) continue;
            if (!rolls[roll.name]) {
                rolls[roll.name] = {};
            }
            user = rolls[roll.name];
            if (!user[roll.getKey()]) {
                user[roll.getKey()] = {
                    fumble: false,
                    failure: false,
                    regularSuccess: false,
                    hardSuccess: false,
                    extremeSuccess: false,
                    critical: false,
                };
            }
            userCommand = user[roll.getKey()];
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
            }else if (roll.result == "成功") {
                userCommand.regularSuccess = true;
            }
        }
        var result = "";
        for (userName in rolls) {
            var userRoll = rolls[userName];
            var successSkills = "";
            var unsuccessSkills = "";
            var failureSkills = "";
            for (userCommandName in userRoll) {
                var userCommand = userRoll[userCommandName];
                if (userCommand.critical) {
                    successSkills += `${userCommandName}★Critical\n`;
                } else if (userCommand.extremeSuccess) {
                    successSkills += `${userCommandName}◎Extreme\n`;
                } else if (userCommand.hardSuccess) {
                    successSkills += `${userCommandName}○Hard\n`;
                } else if (userCommand.regularSuccess) {
                    successSkills += `${userCommandName}○Regular\n`;
                } else if (userCommand.fumble) {
                    unsuccessSkills += `${userCommandName}▲Fumble\n`;
                } else if (userCommand.failure) {
                    unsuccessSkills += `${userCommandName}△Failure\n`;
                }

                if (userCommand.fumble) {
                    failureSkills += `${userCommandName}▲Fumble\n`;
                } else if (userCommand.failure) {
                    failureSkills += `${userCommandName}△Failure\n`;
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
    document.title = "ツール | R'lyeh House";
};
