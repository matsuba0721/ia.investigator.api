function dice(i) {
    return Math.floor(Math.random() * i) + 1;
}
function diceRoll(x, y) {
    var results = [];
    var resultSum = 0;
    for (let i = 0; i < x; i++) {
        var result = dice(y);
        results.push(result.toString());
        resultSum += result;
    }

    $.uiAlert({
        textHead: "Dice Roll!",
        text: `${x}D${y} > ${results.join(", ")} > ${resultSum}`,
        bgcolor: "#272b30",
        textcolor: "#fff",
        position: "top-right",
        icon: "",
        time: 3,
    });
}
function emptyBy(value, str) {
    return !value ? str : value;
}
function getParam(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name);
}
function setParam(name, value) {
    var url = new URL(window.location.href);
    value = value.toString();
    if (!url.searchParams.get(name)) {
        url.searchParams.append(name, value);
        location.href = url;
    } else if (url.searchParams.get(name) != value) {
        url.searchParams.set(name, value);
        location.href = url;
    }
}
async function sha256(str) {
    const buff = new Uint8Array([].map.call(str, (c) => c.charCodeAt(0))).buffer;
    const digest = await crypto.subtle.digest("SHA-256", buff);
    return [].map.call(new Uint8Array(digest), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
function toTags(str) {
    str = emptyBy(str, "");
    return str.replaceAll("　", " ").split(" ");
}

function initAccount(account) {
    $("#account-name")[0].innerText = account.name;
    if (account.id == 0) {
        $("#account-recommendation").show();
        $("#account-sign-out").hide();
        $("#account-sign-in").show();
    } else {
        $("#account-recommendation").hide();
        $("#account-sign-in").hide();
        $("#account-sign-out").show();
    }
    accountChanged(account);
}
function initSigns() {
    $("#account-sign-in")[0].addEventListener("click", function (e) {
        $(".ui.account-sign-up").hide();
        $(".ui.account-sign-in").show();
        $(".ui.account.modal").modal({ duration: 200 }).modal("show");
    });
    $("#account-sign-out")[0].addEventListener("click", function (e) {
        account = signOut();
        initAccount(account);
    });

    $("#account-sign-in-send")[0].addEventListener("click", function (e) {
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        sha256(password).then((hashedPassword) => {
            signIn(username, hashedPassword, function (newAccount) {
                $(".ui.account.modal").modal({ duration: 200 }).modal("hide");
                initAccount(newAccount);
                account = newAccount;
            });
        });
    });
    $('input[name="password"]').keypress(function (e) {
        if (e.keyCode == 13) {
            var username = $('input[name="username"]').val();
            var password = $('input[name="password"]').val();
            sha256(password).then((hashedPassword) => {
                signIn(username, hashedPassword, function (newAccount) {
                    $(".ui.account.modal").modal({ duration: 200 }).modal("hide");
                    initAccount(newAccount);
                    account = newAccount;
                });
            });
        }
    });
    $("#account-sign-up-send")[0].addEventListener("click", function (e) {
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var passwordConfirm = $('input[name="password-confirm"]').val();
        var email = $('input[name="email"]').val();
        sha256(password).then((hashedPassword) => {
            signUp(username, password, passwordConfirm, hashedPassword, email, function (newAccount) {
                $(".ui.account.modal").modal({ duration: 200 }).modal("hide");
                initAccount(newAccount);
                account = newAccount;
            });
        });
    });
    $("#account-sign-in-switch")[0].addEventListener("click", function (e) {
        $(".ui.account-sign-up").hide();
        $(".ui.account-sign-in").show();
    });
    $("#account-sign-up-switch")[0].addEventListener("click", function (e) {
        $(".ui.account-sign-in").hide();
        $(".ui.account-sign-up").show();
    });
}
function getAPIDomain() {
    return "http://localhost:5000/";
}

function notifySucces(text, icon) {
    $.uiAlert({
        textHead: "Succes!",
        text: text,
        bgcolor: "#2185d0",
        textcolor: "#fff",
        position: "top-right",
        icon: icon + " icon",
        time: 1,
    });
}
function notifyFailure(text, icon) {
    $.uiAlert({
        textHead: "Failure!",
        text: text,
        bgcolor: "#db2828",
        textcolor: "#fff",
        position: "top-right",
        icon: icon + " icon",
        time: 2,
    });
}

function exportChatpalete(investigator, isSpendLuck) {
    var san = investigator.parameter.san;
    var str = investigator.parameter.str + investigator.parameter.strGrow;
    var con = investigator.parameter.con + investigator.parameter.conGrow;
    var pow = investigator.parameter.pow + investigator.parameter.powGrow;
    var dex = investigator.parameter.dex + investigator.parameter.dexGrow;
    var app = investigator.parameter.app + investigator.parameter.appGrow;
    var siz = investigator.parameter.siz + investigator.parameter.sizGrow;
    var int = investigator.parameter.int + investigator.parameter.intGrow;
    var edu = investigator.parameter.edu + investigator.parameter.eduGrow;
    var ide = investigator.parameter.getIde() + investigator.parameter.ideGrow;
    var knw = investigator.parameter.getKnw() + investigator.parameter.knwGrow;
    var luk = investigator.parameter.luk + investigator.parameter.lukGrow;
    var commnads = "";

    commnads += `CC<={SAN} 【SAN値チェック】`;
    commnads += `\nCC<=${str} 【*STR】`;
    commnads += `\nCC<=${con} 【*CON】`;
    commnads += `\nCC<=${pow} 【*POW】`;
    commnads += `\nCC<=${dex} 【*DEX】`;
    commnads += `\nCC<=${app} 【*APP】`;
    commnads += `\nCC<=${siz} 【*SIZ】`;
    commnads += `\nCC<=${int} 【*INT】`;
    commnads += `\nCC<=${edu} 【*EDU】`;
    commnads += `\nCC<=${ide} 【*アイデア】`;
    commnads += `\nCC<=${knw} 【*知識】`;
    if (isSpendLuck) {
        commnads += `\nCC<={幸運} 【幸運】`;
    } else {
        commnads += `\nCC<=${luk} 【*幸運】`;
    }
    commnads += "\n";
    for (var i = 0; i < investigator.skills.length; i++) {
        var skill = investigator.skills[i];
        var fullname = skill.subname ? `${skill.name}(${skill.subname})` : skill.name;
        commnads += `\nCC<=${skill.init + skill.job + skill.interest + skill.grow + skill.other} 【${fullname}】`;
    }

    commnads += "\n";
    for (var i = 0; i < investigator.weapons.length; i++) {
        var weapon = investigator.weapons[i];
        var range = weapon.range ? ` 射程:${weapon.range}` : "";
        var attacks = weapon.attacks ? ` 回数:${weapon.attacks}` : "";
        var elastic = weapon.elastic ? ` 装弾数:${weapon.elastic}` : "";
        var failure = weapon.failure ? ` 故障:${weapon.failure}` : "";
        commnads += `${i == 0 ? "" : "\n"}【武器:${weapon.name}` + range + attacks + elastic + failure + "】";
        commnads += `\nCC<=${weapon.rate} 【${weapon.name}】`;
        if (weapon.damage) {
            if (weapon.attacks.startsWith("フル") || weapon.attacks.startsWith("ﾌﾙ")) {
                commnads += `\nFAR(${weapon.elastic},${weapon.rate},${weapon.failure},0,e,) 【${weapon.name}】`;
            }
            commnads += `\n${weapon.damage.toLowerCase().replace("db", investigator.parameter.getDb())} 【${weapon.name}DMG】`;
        }
    }
    return commnads;
}

function getCcfoliaClipboardInvestigator(investigator) {
    var isLuk = $("#investigator-export-commands-copy-ccfolia-luk")[0].checked;
    var isParametor = $("#investigator-export-commands-copy-ccfolia-parametor")[0].checked;
    var isSecret = $("#investigator-export-commands-copy-ccfolia-secret")[0].checked;
    var isInvisible = $("#investigator-export-commands-copy-ccfolia-invisible")[0].checked;
    var isHideStatus = $("#investigator-export-commands-copy-ccfolia-hideStatus")[0].checked;

    var name = investigator.profile.name + (investigator.profile.kana ? `(${investigator.profile.kana})` : "");

    var hp = investigator.parameter.getHp() + investigator.parameter.hpGrow;
    var mp = investigator.parameter.getMp() + investigator.parameter.mpGrow;
    var san = investigator.parameter.san;
    var luk = investigator.parameter.luk + investigator.parameter.lukGrow;

    var str = investigator.parameter.str + investigator.parameter.strGrow;
    var con = investigator.parameter.con + investigator.parameter.conGrow;
    var pow = investigator.parameter.pow + investigator.parameter.powGrow;
    var dex = investigator.parameter.dex + investigator.parameter.dexGrow;
    var app = investigator.parameter.app + investigator.parameter.appGrow;
    var siz = investigator.parameter.siz + investigator.parameter.sizGrow;
    var int = investigator.parameter.int + investigator.parameter.intGrow;
    var edu = investigator.parameter.edu + investigator.parameter.eduGrow;
    var ide = investigator.parameter.getIde() + investigator.parameter.ideGrow;
    var knw = investigator.parameter.getKnw() + investigator.parameter.knwGrow;
    var bld = investigator.parameter.getBld();
    var db = investigator.parameter.getDb();
    var mov = investigator.parameter.getMov();

    var ccfoliaInvestigator = {
        kind: "character",
        data: {
            active: true,
            secret: isSecret,
            invisible: isInvisible,
            hideStatus: isHideStatus,
            name: name,
            initiative: dex,
            status: [
                { label: "HP", value: hp, max: hp },
                { label: "MP", value: mp, max: mp },
                { label: "SAN", value: san, max: san },
            ],
            params: [],
            commands: exportChatpalete(investigator, isLuk),
        },
    };

    if (isLuk) {
        ccfoliaInvestigator.data.status.push({ label: "幸運", value: luk, max: luk });
    }
    if (isParametor) {
        var luk = investigator.parameter.luk + investigator.parameter.lukGrow;
        ccfoliaInvestigator.data.params = [
            { label: "STR", value: str.toString() },
            { label: "CON", value: con.toString() },
            { label: "POW", value: pow.toString() },
            { label: "DEX", value: dex.toString() },
            { label: "APP", value: app.toString() },
            { label: "SIZ", value: siz.toString() },
            { label: "INT", value: int.toString() },
            { label: "EDU", value: edu.toString() },
            { label: "ビルド", value: bld.toString() },
            { label: "DB", value: db.toString() },
            { label: "MOV", value: mov.toString() },
        ];
    }

    return ccfoliaInvestigator;
}
function writeClipboard(str) {
    if (navigator.clipboard) {
        try {
            navigator.clipboard.writeText(str);
            notifySucces("クリップボードにコピーしました。", "clipboard check");
        } catch (err) {
            console.log(err);
            notifyFailure("クリップボードのコピーに失敗しました。", "exclamation triangle");
        }
    }
}
function override(investigator) {
    investigator.parameter.getIde = function () {
        return this.int + this.intGrow;
    };
    investigator.parameter.getKnw = function () {
        return this.edu + this.eduGrow;
    };
    investigator.parameter.getBld = function () {
        var v = this.str + this.siz;
        if (v < 65) return -2;
        else if (v < 85) return -1;
        else if (v < 125) return 0;
        else if (v < 165) return 1;
        else if (v < 205) return 2;
        else if (v < 285) return 3;
        else if (v < 365) return 4;
        else if (v < 445) return 5;
        else if (v < 525) return 6;
        else {
            return Math.floor((v - 525) / 80) + 6;
        }
    };
    investigator.parameter.getDb = function () {
        var v = this.str + this.siz;
        if (v < 65) return -2;
        else if (v < 85) return -1;
        else if (v < 125) return 0;
        else if (v < 165) return "1D4";
        else if (v < 205) return "1D6";
        else if (v < 285) return "2D6";
        else if (v < 365) return "3D6";
        else if (v < 445) return "4D6";
        else if (v < 525) return "5D6";
        else {
            var d = Math.floor((v - 525) / 80) + 5;
            return "" + d + "D6";
        }
    };
    investigator.parameter.getHp = function () {
        return Math.floor((this.con + this.siz) / 10);
    };
    investigator.parameter.getMp = function () {
        return Math.floor(this.pow / 5);
    };
    investigator.parameter.getMov = function () {
        if (this.dex < this.siz && this.str < this.siz) return 7;
        else if (this.dex > this.siz && this.str > this.siz) return 9;
        else return 8;
    };
    investigator.parameter.getJobPoint = function (jobPointsCalculation) {
        var exp = emptyBy(jobPointsCalculation, "EDU×4")
            .replaceAll("×", "*")
            .toLowerCase()
            .replace("edu", this.edu + this.eduGrow)
            .replace("str", this.str + this.strGrow)
            .replace("con", this.con + this.conGrow)
            .replace("pow", this.pow + this.powGrow)
            .replace("dex", this.dex + this.dexGrow)
            .replace("siz", this.siz + this.sizGrow)
            .replace("app", this.app + this.appGrow);
        return eval(exp);
    };
    investigator.parameter.getInterestPoint = function () {
        return this.int * 2;
    };
    investigator.getProfileImagePath = function () {
        return `img?v=${this.id}`;
    };

    return investigator;
}

function getLoginAccount() {
    var account = $.cookie("account");
    return account ? JSON.parse(account) : { id: 0, name: "Guest" };
}
function signIn(username, password, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("ログインに失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                $.cookie("account", JSON.stringify(data.result), { expires: 7 });
                func(data.result);
            } else if (data.code == 100) {
                notifyFailure("ユーザ名かパスワードが間違っています。", "exclamation triangle");
            } else {
                notifyFailure("ログインに失敗しました。", "exclamation triangle");
            }
        };

        request.open("POST", "getAccount/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ username: username, password: password }));
    } catch (err) {
        console.log(err);
        notifyFailure("ログインに失敗しました。", "exclamation triangle");
    }
    return;
}
function signUp(username, password, passwordConfirm, hashedPassword, email, func) {
    try {
        if (password.length < 8 || password.length > 16) {
            notifyFailure("パスワードは8文字以上16文字以下です。", "exclamation triangle");
            return;
        }
        if (password != passwordConfirm) {
            notifyFailure("パスワードが一致していません。", "exclamation triangle");
            return;
        }
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("アカウント作成に失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                $.cookie("account", JSON.stringify(data.result), { expires: 7 });
                notifySucces("新規作成完了しました。", "sign-up");
                func(data.result);
            } else if (data.code == 101) {
                notifyFailure("このユーザ名は存在しています。", "exclamation triangle");
            } else {
                notifyFailure("アカウント作成に失敗しました。", "exclamation triangle");
            }
        };

        request.open("POST", "saveAccount/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ username: username, password: hashedPassword, email: email }));
    } catch (err) {
        console.log(err);
        notifyFailure("アカウント作成に失敗しました。", "exclamation triangle");
    }
}
function signOut() {
    try {
        var account = getLoginAccount();
        if (account.id != 0) {
            $.removeCookie("account");
            notifySucces("ログアウトしました。", "sign-out");
            return getLoginAccount();
        }
    } catch (err) {
        console.log(err);
        notifyFailure("ログアウトに失敗しました。", "exclamation triangle");
    }
    return;
}
function getNewInvestigator(account, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("新規データ作成を開始できませんでした。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                func(data.result.id);
            } else {
                notifyFailure("新規データ作成を開始できませんでした。", "exclamation triangle");
            }
        };

        request.open("POST", "getNewInvestigator/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ token: account.token }));
    } catch (err) {
        console.log(err);
        notifyFailure("新規データ作成を開始できませんでした。", "exclamation triangle");
    }
}
function getInvestigatorEditable(account, id, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("編集権限を取得できませんでした。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                func(data.result.editable);
            } else {
                notifyFailure("編集権限を取得できませんでした。", "exclamation triangle");
            }
        };

        request.open("POST", "getInvestigatorEditable/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ token: account.token, id: id }));
    } catch (err) {
        console.log(err);
        notifyFailure("編集権限を取得できませんでした。", "exclamation triangle");
    }
}
function getEditingInvestigator(account, investigatorId, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                var investigator = data.result;
                investigator.memo = emptyBy(data.result.memo, "").replaceAll("\\n", "\n");
                func(override(investigator));
            } else {
                notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
            }
        };

        request.open("POST", "getInvestigator/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ id: investigatorId }));
    } catch (err) {
        console.log(err);
        notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
    }
}
function saveEditingInvestigator(account, investigator, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("保存に失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                notifySucces("保存しました。", "save check");
                func(data.result.id);
            } else {
                notifyFailure("保存に失敗しました。", "exclamation triangle");
            }
        };

        request.open("POST", "saveInvestigator/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ token: account.token, investigator: investigator }));
    } catch (err) {
        console.log(err);
        notifyFailure("保存に失敗しました。", "exclamation triangle");
    }
}
function saveInvestigatorProfileImage(account, id, image, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("画像のアップロードに失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code != 0) {
                notifyFailure("画像のアップロードに失敗しました。", "exclamation triangle");
            }
            func();
        };

        request.open("POST", "saveInvestigatorProfileImage/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ token: account.token, id: id, image: image }));
    } catch (err) {
        console.log(err);
        notifyFailure("画像のアップロードに失敗しました。", "exclamation triangle");
    }
}
function getUserInvestigators(account, func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                var investigators = data.result;
                func(investigators);
            } else {
                notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
            }
        };

        request.open("POST", "getUserInvestigators/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ token: account.token }));
    } catch (err) {
        console.log(err);
        notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
    }
}
function getRecentlyCreatedInvestigators(func) {
    try {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.ontimeout = function () {
            notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
        };
        request.onload = function () {
            var data = this.response;
            if (data.code == 0) {
                var investigators = data.result;
                func(investigators);
            } else {
                notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
            }
        };

        request.open("POST", "getRecentlyCreatedInvestigators/", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send();
    } catch (err) {
        console.log(err);
        notifyFailure("キャラクターデータの読み込みに失敗しました。", "exclamation triangle");
    }
}
