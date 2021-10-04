function accountChanged(account) {
    getInvestigatorEditable(account, parseInt(getParam("v")), function (editable) {
        if (editable) {
            $("#investigator-save").prop("disabled", false);
            $("#upload-profile-image").prop("disabled", false);
        } else {
            $("#investigator-save").prop("disabled", true);
            $("#upload-profile-image").prop("disabled", true);
        }
    });
}
async function saveLocalInvestigator(investigator) {
    if (localInvestigators.length == 0) {
        localInvestigators = localStorage.localInvestigators ? JSON.parse(localStorage.localInvestigators) : [];
        localInvestigators.push(investigator);
        if (localInvestigators.length > 11) {
            localInvestigators = localInvestigators.slice(localInvestigators.length - 11, -1);
        }
    }

    localStorage.localInvestigators = JSON.stringify(localInvestigators);
}
function initRandamGenerateParameter() {
    $("#randam-generate-parameter").on("click", function () {
        ["str", "con", "pow", "dex", "app", "siz", "int", "edu", "luk"].forEach((param) => {
            $("#start-standard-generate-parametor").prop("disabled", false);
            $(`#${param}-standard-roll .dice`).each(function (index, element) {
                element.src = `/images/dice0.png`;
            });
            $(`#${param}-standard-result`)[0].innerText = "0";

            $("#start-custom-generate-parametor").prop("disabled", false);
            $(`#${param}-custom-dice-count`)[0].value = 3;
            $(`#${param}-custom-dice-number`)[0].value = 6;
            $(`#${param}-custom-dice-correction`)[0].value = 0;
            $(`#${param}-custom-result`)[0].innerText = "0";
        });
        $(".ui.mini.generate.modal").modal({ duration: 200 }).modal("show");
    });
    $("#start-standard-generate-parametor").on("click", function () {
        $("#start-standard-generate-parametor").prop("disabled", true);
        var rollTicks = 0;
        var intervalId = setInterval(() => {
            rollTicks += 1;
            ["str", "con", "pow", "dex", "app", "siz", "int", "edu", "luk"].forEach((param) => {
                var total = 0,
                    lastindex = 0;
                $(`#${param}-standard-roll .dice`).each(function (index, element) {
                    var num = dice(6);
                    element.src = `/images/dice${num}.png`;
                    total += num * 5;
                    lastindex = index;
                });
                if (lastindex < 2) total += 30;
                $(`#${param}-standard-result`)[0].innerText = total;
            });
            if (rollTicks > 10) {
                $("#start-standard-generate-parametor").prop("disabled", false);
                clearInterval(intervalId);
            }
        }, 50);
    });
    $("#set-standard-generate-parametor").on("click", function () {
        setRandamGeneratedParameter("standard");
    });
    $("#start-custom-generate-parametor").on("click", function () {
        $("#start-custom-generate-parametor").prop("disabled", true);
        var rollTicks = 0;
        var intervalId = setInterval(() => {
            rollTicks += 1;
            ["str", "con", "pow", "dex", "app", "siz", "int", "edu", "luk"].forEach((param) => {
                var diceCount = parseInt($(`#${param}-custom-dice-count`)[0].value);
                var diceNumber = parseInt($(`#${param}-custom-dice-number`)[0].value);
                var diceCorrection = parseInt($(`#${param}-custom-dice-correction`)[0].value);
                var total = diceCorrection * 5;
                var results = [];
                for (var i = 0; i < diceCount; i++) {
                    var num = dice(diceNumber);
                    results.push(num);
                    total += num * 5;
                }
                $(`#${param}-custom-dice-console`)[0].value = `[${results.join(",")}]+${diceCorrection}`;
                $(`#${param}-custom-result`)[0].innerText = total;
            });
            if (rollTicks > 10) {
                $("#start-custom-generate-parametor").prop("disabled", false);
                clearInterval(intervalId);
            }
        }, 50);
    });
    $("#set-custom-generate-parametor").on("click", function () {
        setRandamGeneratedParameter("custom");
    });
    $("#set-from6-generate-parametor").on("click", function () {
        setRandamGeneratedParameter("from6");
    });

    ["str", "con", "pow", "dex", "app", "siz", "int", "edu", "luk"].forEach((param) => {
        $(`#${param}-from6-param`)[0].addEventListener("input", function (e) {
            var path = e.path || (e.composedPath && e.composedPath());
            var prop = path[0].id.replace("-from6-param", "");
            var value = path[0].value;
            if (prop == "edu") {
                if (value < 18) $(`#${prop}-from6-result`)[0].innerText = value * 5;
                else if (value < 27) $(`#${prop}-from6-result`)[0].innerText = 90 + (value - 18);
                else $(`#${prop}-from6-result`)[0].innerText = 99;
            } else if (prop == "luk") {
                $(`#${prop}-from6-result`)[0].innerText = value;
            } else {
                $(`#${prop}-from6-result`)[0].innerText = value * 5;
            }
        });
    });
}
function setRandamGeneratedParameter(tabName) {
    var parameter = investigator.parameter;
    parameter.str = parseInt($(`#str-${tabName}-result`)[0].innerText);
    parameter.con = parseInt($(`#con-${tabName}-result`)[0].innerText);
    parameter.pow = parseInt($(`#pow-${tabName}-result`)[0].innerText);
    parameter.dex = parseInt($(`#dex-${tabName}-result`)[0].innerText);
    parameter.app = parseInt($(`#app-${tabName}-result`)[0].innerText);
    parameter.siz = parseInt($(`#siz-${tabName}-result`)[0].innerText);
    parameter.int = parseInt($(`#int-${tabName}-result`)[0].innerText);
    parameter.edu = parseInt($(`#edu-${tabName}-result`)[0].innerText);
    parameter.luk = parseInt($(`#luk-${tabName}-result`)[0].innerText);
    parameter.san = parameter.pow;

    parameter.strGrow = 0;
    parameter.conGrow = 0;
    parameter.sizGrow = 0;
    parameter.dexGrow = 0;
    parameter.appGrow = 0;
    parameter.intGrow = 0;
    parameter.powGrow = 0;
    parameter.eduGrow = 0;
    parameter.lukGrow = 0;
    parameter.ideGrow = 0;
    parameter.knwGrow = 0;
    parameter.hpGrow = 0;
    parameter.mpGrow = 0;

    if (tabName == "from6") {
        parameter.hpGrow = Math.ceil((parameter.con + parameter.siz) / 10) - parameter.getHp();
    }

    $("#param-str")[0].value = parameter.str;
    $("#param-con")[0].value = parameter.con;
    $("#param-pow")[0].value = parameter.pow;
    $("#param-dex")[0].value = parameter.dex;
    $("#param-app")[0].value = parameter.app;
    $("#param-siz")[0].value = parameter.siz;
    $("#param-int")[0].value = parameter.int;
    $("#param-edu")[0].value = parameter.edu;
    $("#param-luk")[0].value = parameter.luk;
    $("#param-san")[0].value = parameter.san;
    $("#param-str-grow")[0].value = parameter.strGrow;
    $("#param-con-grow")[0].value = parameter.conGrow;
    $("#param-pow-grow")[0].value = parameter.powGrow;
    $("#param-dex-grow")[0].value = parameter.dexGrow;
    $("#param-app-grow")[0].value = parameter.appGrow;
    $("#param-siz-grow")[0].value = parameter.sizGrow;
    $("#param-int-grow")[0].value = parameter.intGrow;
    $("#param-edu-grow")[0].value = parameter.eduGrow;
    $("#param-luk-grow")[0].value = parameter.lukGrow;
    $("#param-ide-grow")[0].value = parameter.ideGrow;
    $("#param-knw-grow")[0].value = parameter.knwGrow;
    $("#param-hp-grow")[0].value = parameter.hpGrow;
    $("#param-mp-grow")[0].value = parameter.mpGrow;

    viewUpdate(true);
    $(".ui.mini.generate.modal").modal({ duration: 200 }).modal("hide");
}
function initInitialSkills() {
    $("#initial-skill-hide").on("click", function () {
        for (var i = 0; i < investigator.skills.length; i++) {
            skill = investigator.skills[i];
            if (skill.job + skill.interest + skill.grow + skill.other > 0) {
                $(`#skill-${skill.id}-row`).show();
            } else {
                $(`#skill-${skill.id}-row`).hide();
            }
        }

        $("#initial-skill-hide").hide();
        $("#initial-skill-show").show();
    });
    $("#initial-skill-show").on("click", function () {
        $("#initial-skill-show").hide();
        $("#initial-skill-hide").show();

        $("#skill-combat-table tr").show();
        $("#skill-survey-table tr").show();
        $("#skill-personal-table tr").show();
        $("#skill-conduct-table tr").show();
        $("#skill-transfer-table tr").show();
        $("#skill-knowledge-table tr").show();
        $("#skill-uncommon-table tr").show();
    });
}
function initExport() {
    $("#investigator-export")[0].addEventListener("click", function (e) {
        $("#investigator-export-chatpalette")[0].value = exportChatpalete(investigator, false);
        $(".ui.tiny.export.modal").modal({ duration: 200 }).modal("show");
    });
    $("#investigator-export-commands-copy")[0].addEventListener("click", function (e) {
        writeClipboard($("#investigator-export-chatpalette")[0].value);
    });

    $("#investigator-export-commands-copy-ccfolia")[0].addEventListener("click", function (e) {
        var ccfoliaInvestigator = getCcfoliaClipboardInvestigator(investigator);
        writeClipboard(JSON.stringify(ccfoliaInvestigator));
    });
}
function initDiceRoll() {
    $("#dice-roll-1x100")[0].addEventListener("click", function (e) {
        diceRoll(1, 100);
    });
    $("#dice-roll-1x10")[0].addEventListener("click", function (e) {
        diceRoll(1, 10);
    });
    $("#dice-roll-1x6")[0].addEventListener("click", function (e) {
        diceRoll(1, 6);
    });
    $("#dice-roll-2x6")[0].addEventListener("click", function (e) {
        diceRoll(2, 6);
    });
    $("#dice-roll-3x6")[0].addEventListener("click", function (e) {
        diceRoll(3, 6);
    });
}

function initInvestigator(investigator) {
    initProfile(investigator.profile);
    initParameter(investigator.parameter);

    for (var i = 0; i < investigator.skills.length; i++) {
        investigator.skills[i].id = i;
        initSkill(investigator.skills[i]);
    }

    for (var i = 0; i < investigator.weapons.length; i++) {
        investigator.weapons[i].id = i;
        initWeapon(investigator.weapons[i]);
    }

    for (var i = 0; i < investigator.equips.length; i++) {
        investigator.equips[i].id = i;
        initEquip(investigator.equips[i]);
    }

    investigator.getMaxSkillId = function () {
        var max = 0;
        for (var i = 0; i < investigator.skills.length; i++) {
            max = Math.max(investigator.skills[i].id, max);
        }
        return max;
    };
    investigator.getMaxWeaponId = function () {
        var max = 0;
        for (var i = 0; i < investigator.weapons.length; i++) {
            max = Math.max(investigator.weapons[i].id, max);
        }
        return max;
    };
    investigator.getMaxEquipId = function () {
        var max = 0;
        for (var i = 0; i < investigator.equips.length; i++) {
            max = Math.max(investigator.equips[i].id, max);
        }
        return max;
    };

    $("#profile-image")[0].src = investigator.getProfileImagePath();

    $("#param-job-points-calculate")[0].addEventListener("click", function (e) {
        var jobPointsCalculation = $("#param-job-points-calculation")[0].value;
        var exp = emptyBy(jobPointsCalculation, "0")
            .replaceAll("×", "*")
            .toLowerCase()
            .replace("edu", investigator.parameter.edu + investigator.parameter.eduGrow)
            .replace("str", investigator.parameter.str + investigator.parameter.strGrow)
            .replace("con", investigator.parameter.con + investigator.parameter.conGrow)
            .replace("pow", investigator.parameter.pow + investigator.parameter.powGrow)
            .replace("dex", investigator.parameter.dex + investigator.parameter.dexGrow)
            .replace("siz", investigator.parameter.siz + investigator.parameter.sizGrow)
            .replace("app", investigator.parameter.app + investigator.parameter.appGrow);
        console.log(exp);
        $("#param-job-points")[0].value = eval(exp);
        eval("investigator.parameter.jobPoints=" + emptyBy($("#param-job-points")[0].value, "0"));
        viewUpdate(true);
    });
    $("#param-job-points")[0].addEventListener("input", function (e) {
        eval("investigator.parameter.jobPoints=" + emptyBy($("#param-job-points")[0].value, "0"));
        viewUpdate(true);
    });
    $("#param-job-points-correction")[0].addEventListener("input", function (e) {
        eval("investigator.parameter.jobPointsCorrection=" + emptyBy($("#param-job-points-correction")[0].value, "0"));
        viewUpdate(true);
    });
    $("#param-interest-points-correction")[0].addEventListener("input", function (e) {
        eval("investigator.parameter.interestPointsCorrection=" + emptyBy($("#param-interest-points-correction")[0].value, "0"));
        viewUpdate(true);
    });

    $("#append-skill-combat")[0].addEventListener("click", appendSkill);
    $("#append-skill-survey")[0].addEventListener("click", appendSkill);
    $("#append-skill-personal")[0].addEventListener("click", appendSkill);
    $("#append-skill-conduct")[0].addEventListener("click", appendSkill);
    $("#append-skill-transfer")[0].addEventListener("click", appendSkill);
    $("#append-skill-knowledge")[0].addEventListener("click", appendSkill);
    $("#append-skill-uncommon")[0].addEventListener("click", appendSkill);

    $("#append-skill-combat-malee")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-combat-firearms")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-conduct-arts")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-conduct-survival")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-transfer-drive")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-transfer-control")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-knowledge-folklore")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-knowledge-science")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-knowledge-native")[0].addEventListener("click", appendSpecificSkill);
    $("#append-skill-knowledge-language")[0].addEventListener("click", appendSpecificSkill);

    $("#append-weapon")[0].addEventListener("click", appendWeapon);

    $("#append-equip")[0].addEventListener("click", appendEquip);

    initMoney(investigator.money);
    initBackstory(investigator.backstory);

    $("#memo")[0].value = investigator.memo;
    $("#memo")[0].addEventListener("input", function (e) {
        investigator.memo = $("#memo")[0].value;
    });

    $("#isHidden")[0].checked = investigator.isHidden;
    $("#isHidden")[0].addEventListener("change", function (e) {
        investigator.isHidden = $("#isHidden")[0].checked;
    });
    $("#isNPC")[0].checked = investigator.isNPC;
    $("#isNPC")[0].addEventListener("change", function (e) {
        investigator.isNPC = $("#isNPC")[0].checked;
    });
}
function initProfile(profile) {
    $("#profile-name")[0].value = profile.name;
    $("#profile-kana")[0].value = profile.kana;
    $("#profile-tag")[0].value = profile.tag;
    $("#profile-job")[0].value = profile.job;
    $("#profile-age")[0].value = profile.age;
    $("#profile-gender")[0].value = profile.gender;
    $("#profile-height")[0].value = profile.height;
    $("#profile-weight")[0].value = profile.weight;
    $("#profile-origin")[0].value = profile.origin;
    $("#profile-hairColor")[0].value = profile.hairColor;
    $("#profile-eyeColor")[0].value = profile.eyeColor;
    $("#profile-skinColor")[0].value = profile.skinColor;

    $("#profile-name")[0].addEventListener("input", updateProfile);
    $("#profile-kana")[0].addEventListener("input", updateProfile);
    $("#profile-tag")[0].addEventListener("input", updateProfile);
    $("#profile-job")[0].addEventListener("input", updateProfile);
    $("#profile-age")[0].addEventListener("input", updateProfile);
    $("#profile-gender")[0].addEventListener("input", updateProfile);
    $("#profile-height")[0].addEventListener("input", updateProfile);
    $("#profile-weight")[0].addEventListener("input", updateProfile);
    $("#profile-origin")[0].addEventListener("input", updateProfile);
    $("#profile-hairColor")[0].addEventListener("input", updateProfile);
    $("#profile-eyeColor")[0].addEventListener("input", updateProfile);
    $("#profile-skinColor")[0].addEventListener("input", updateProfile);

    $("#upload-profile-image")[0].addEventListener(
        "change",
        function (evt) {
            var file = evt.target.files;
            var reader = new FileReader();
            var imgReader = new Image();
            var imgHeight = 300;
            reader.readAsDataURL(file[0]);
            reader.onload = function () {
                imgReader.onload = () => {
                    const imgType = imgReader.src.substring(5, imgReader.src.indexOf(";"));
                    const imgWidth = imgReader.width * (imgHeight / imgReader.height);
                    const canvas = document.createElement("canvas");
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(imgReader, 0, 0, imgWidth, imgHeight);
                    $("#profile-image")[0].src = "images/loading.gif";
                    saveInvestigatorProfileImage(account, investigator.id, canvas.toDataURL(imgType), function () {
                        $("#profile-image")[0].src = canvas.toDataURL(imgType);
                    });
                };
                imgReader.src = reader.result;
            };
        },
        false
    );
}
function updateProfile(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/profile-(\w+)/);
    if (matches == null) return;
    var prop = matches[1];
    eval("investigator.profile." + prop + '="' + $("#profile-" + prop)[0].value + '"');

    viewUpdate(true);
}

function initParameter(parameter) {
    $("#param-str")[0].value = parameter.str;
    $("#param-str-grow")[0].value = parameter.strGrow;
    $("#param-con")[0].value = parameter.con;
    $("#param-con-grow")[0].value = parameter.conGrow;
    $("#param-pow")[0].value = parameter.pow;
    $("#param-pow-grow")[0].value = parameter.powGrow;
    $("#param-dex")[0].value = parameter.dex;
    $("#param-dex-grow")[0].value = parameter.dexGrow;
    $("#param-app")[0].value = parameter.app;
    $("#param-app-grow")[0].value = parameter.appGrow;
    $("#param-siz")[0].value = parameter.siz;
    $("#param-siz-grow")[0].value = parameter.sizGrow;
    $("#param-int")[0].value = parameter.int;
    $("#param-int-grow")[0].value = parameter.intGrow;
    $("#param-edu")[0].value = parameter.edu;
    $("#param-edu-grow")[0].value = parameter.eduGrow;
    $("#param-luk")[0].value = parameter.luk;
    $("#param-luk-grow")[0].value = parameter.lukGrow;
    $("#param-ide-grow")[0].value = parameter.ideGrow;
    $("#param-knw-grow")[0].value = parameter.knwGrow;
    $("#param-hp-grow")[0].value = parameter.hpGrow;
    $("#param-mp-grow")[0].value = parameter.mpGrow;
    $("#param-san")[0].value = parameter.san;
    $("#param-job-points")[0].value = parameter.jobPoints;
    $("#param-job-points-correction")[0].value = parameter.jobPointsCorrection;
    $("#param-interest-points-correction")[0].value = parameter.interestPointsCorrection;

    $("#param-str")[0].addEventListener("input", updateParameter);
    $("#param-str-grow")[0].addEventListener("input", updateParameter);
    $("#param-con")[0].addEventListener("input", updateParameter);
    $("#param-con-grow")[0].addEventListener("input", updateParameter);
    $("#param-pow")[0].addEventListener("input", updateParameter);
    $("#param-pow-grow")[0].addEventListener("input", updateParameter);
    $("#param-dex")[0].addEventListener("input", updateParameter);
    $("#param-dex-grow")[0].addEventListener("input", updateParameter);
    $("#param-app")[0].addEventListener("input", updateParameter);
    $("#param-app-grow")[0].addEventListener("input", updateParameter);
    $("#param-siz")[0].addEventListener("input", updateParameter);
    $("#param-siz-grow")[0].addEventListener("input", updateParameter);
    $("#param-int")[0].addEventListener("input", updateParameter);
    $("#param-int-grow")[0].addEventListener("input", updateParameter);
    $("#param-edu")[0].addEventListener("input", updateParameter);
    $("#param-edu-grow")[0].addEventListener("input", updateParameter);
    $("#param-luk")[0].addEventListener("input", updateParameter);
    $("#param-luk-grow")[0].addEventListener("input", updateParameter);
    $("#param-ide")[0].addEventListener("input", updateParameter);
    $("#param-ide-grow")[0].addEventListener("input", updateParameter);
    $("#param-knw")[0].addEventListener("input", updateParameter);
    $("#param-knw-grow")[0].addEventListener("input", updateParameter);
    $("#param-hp")[0].addEventListener("input", updateParameter);
    $("#param-hp-grow")[0].addEventListener("input", updateParameter);
    $("#param-mp")[0].addEventListener("input", updateParameter);
    $("#param-mp-grow")[0].addEventListener("input", updateParameter);
    $("#param-san")[0].addEventListener("input", function (e) {
        investigator.parameter.san = parseInt($("#param-san")[0].value);
        viewUpdate(true);
    });
}
function updateParameter(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var prop = path[0].id.replace("param-", "").replace("-grow", "");
    eval("investigator.parameter." + prop + "=" + emptyBy($("#param-" + prop)[0].value, "0"));
    eval("investigator.parameter." + prop + "Grow=" + emptyBy($("#param-" + prop + "-grow")[0].value, "0"));
    $("#param-" + prop + "-present")[0].value = eval("investigator.parameter." + prop + "+" + "investigator.parameter." + prop + "Grow");

    viewUpdate(true);
}

function initSkill(skill) {
    skill.getFullname = function () {
        return this.subname ? `${this.name}(${this.subname})` : this.name;
    };
    skill.getNameId = function () {
        return this.id + "-name";
    };
    skill.getSubnameId = function () {
        return this.id + "-subname";
    };
    skill.getInitId = function () {
        return this.id + "-init";
    };
    skill.getJobId = function () {
        return this.id + "-job";
    };
    skill.getInterestId = function () {
        return this.id + "-interest";
    };
    skill.getGrowId = function () {
        return this.id + "-grow";
    };
    skill.getOtherId = function () {
        return this.id + "-other";
    };
    skill.getPresentId = function () {
        return this.id + "-present";
    };
    skill.getDeleteButtonId = function () {
        return this.id + "-delete";
    };

    $("#skill-" + skill.category + "-table").append(ToSkillTr(skill));
    $("#skill-" + skill.getNameId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.getSubnameId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.getInitId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.getJobId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.getInterestId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.getGrowId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.getOtherId())[0].addEventListener("input", updateSkill);
    $("#skill-" + skill.id + "-delete")[0].addEventListener("click", deleteSkill);
}
function createSkill(category, name) {
    var skill = new Object();
    skill.category = category;
    skill.id = investigator.getMaxSkillId() + 1;
    skill.name = name ? name : "";
    skill.subname = "";
    skill.init = 0;
    skill.job = 0;
    skill.interest = 0;
    skill.grow = 0;
    skill.other = 0;
    skill.nameEditable = name ? false : true;
    skill.subnameEditable = name ? true : false;
    skill.initEditable = true;
    skill.deletable = true;
    return skill;
}
function appendSkill(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/append-skill-(\w+)/);
    var skill = createSkill(matches[1]);
    initSkill(skill);
    investigator.skills.push(skill);

    viewUpdate(true);
}
function appendSpecificSkill(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/append-skill-(\w+)/);
    var skill = createSkill(matches[1], path[0].value);
    initSkill(skill);
    investigator.skills.push(skill);

    viewUpdate(true);
}
function updateSkill(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/skill-(\w+)-(\w+)/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var prop = matches[2];
    var skill = investigator.skills.find((v) => v.id === id);
    if (path[0].type == "text") {
        eval("skill." + prop + '="' + $("#skill-" + id + "-" + prop)[0].value + '"');
    } else if (path[0].type == "number") {
        eval("skill." + prop + "=" + emptyBy($("#skill-" + id + "-" + prop)[0].value, "0"));
    }

    viewUpdate(true);
}
function deleteSkill(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = (path[0].id + path[1].id).trim().match(/skill-(\w+)-delete/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var index;
    var found = investigator.skills.some(function (skill, i) {
        index = i;
        return skill.id == id;
    });

    if (!found) return;

    $("#skill-" + investigator.skills[index].id + "-row").remove();
    investigator.skills.splice(index, 1);

    viewUpdate(true);
}
function ToSkillTr(skill) {
    var nameOptionShown = skill.subnameEditable || skill.subname;
    var nameEditableDisabledProp = skill.nameEditable ? "" : " disabled";
    var nameSpan = nameOptionShown ? "" : ' colspan="2"';
    var nameTd = "<td" + nameSpan + '><div class="ui fluid input"><input id="skill-' + skill.getNameId() + '" class="no-spin" type="text" value="' + skill.name + '"' + nameEditableDisabledProp + " /></div></td>";
    var nameOptionHidden = nameOptionShown ? "" : ' style="display:none"';
    var subnameEditableDisabledProp = skill.subnameEditable ? "" : " disabled";
    var subnameTd = "<td" + nameOptionHidden + '><div class="ui fluid input"><input id="skill-' + skill.getSubnameId() + '" class="no-spin" type="text" value="' + skill.subname + '"' + subnameEditableDisabledProp + " /></div></td>";
    var initEditableDisabledProp = skill.initEditable ? "" : " disabled";
    var initTd = '<td><div class="ui fluid input"><input id="skill-' + skill.getInitId() + '" class="no-spin" type="number" value="' + skill.init + '"' + initEditableDisabledProp + " /></div></td>";
    var jobTd = '<td><div class="ui fluid input"><input id="skill-' + skill.getJobId() + '" class="no-spin" type="number" value="' + (skill.job == 0 ? "" : skill.job) + '" /></div></td>';
    var interestTd = '<td><div class="ui fluid input"><input id="skill-' + skill.getInterestId() + '" class="no-spin" type="number" value="' + (skill.interest == 0 ? "" : skill.interest) + '" /></div></td>';
    var growTd = '<td><div class="ui fluid input"><input id="skill-' + skill.getGrowId() + '" class="no-spin" type="number" value="' + (skill.grow == 0 ? "" : skill.grow) + '" /></div></td>';
    var otherTd = '<td><div class="ui fluid input"><input id="skill-' + skill.getOtherId() + '" class="no-spin" type="number" value="' + (skill.other == 0 ? "" : skill.other) + '" /></div></td>';
    var presentTd = '<td><div class="ui fluid input"><input id="skill-' + skill.getPresentId() + '" class="no-spin" type="number" disabled /></div></td>';
    var deleteDisabledProp = skill.deletable ? "" : " disabled";
    var deleteButtonTd = '<td><button id="skill-' + skill.id + '-delete" class="ui compact basic negative icon button"' + deleteDisabledProp + '><i class="close icon"></i></button></td>';
    return '<tr id="skill-' + skill.id + '-row">' + nameTd + subnameTd + initTd + jobTd + interestTd + growTd + otherTd + presentTd + deleteButtonTd + "</tr>";
}

function initWeapon(weapon) {
    weapon.getNameId = function () {
        return this.id + "-name";
    };
    weapon.getRateId = function () {
        return this.id + "-rate";
    };
    weapon.getDamageId = function () {
        return this.id + "-damage";
    };
    weapon.getRangeId = function () {
        return this.id + "-range";
    };
    weapon.getAttacksId = function () {
        return this.id + "-attacks";
    };
    weapon.getElasticId = function () {
        return this.id + "-elastic";
    };
    weapon.getFailureId = function () {
        return this.id + "-failure";
    };
    weapon.getDeleteButtonId = function () {
        return this.id + "-delete";
    };

    $("#weapon-table").append(ToWeaponTr(weapon));
    $("#weapon-" + weapon.getNameId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.getRateId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.getDamageId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.getRangeId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.getAttacksId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.getElasticId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.getFailureId())[0].addEventListener("input", updateWeapon);
    $("#weapon-" + weapon.id + "-delete")[0].addEventListener("click", deleteWeapon);
    $("#weapon-" + weapon.id + "-rate-skill-value")[0].addEventListener("change", function (e) {
        var path = e.path || (e.composedPath && e.composedPath());
        var matches = path[0].id.match(/weapon-(\w+)-rate-skill-value/);
        if (matches == null) return;
        var id = parseInt(matches[1]);

        matches = path[0].value.match(/(\d+)-\d+-(\d+)/);
        if (matches) investigator.weapons[id].rate = parseInt(matches[2]);
        investigator.weapons[id].rateSkillName = !matches ? "任意" : $("#weapon-" + weapon.id + "-rate-skill").dropdown("get text");
    });
}
function appendWeapon(e) {
    var weapon = new Object();
    weapon.category = "common";
    weapon.id = investigator.getMaxWeaponId() + 1;
    weapon.name = "";
    weapon.rate = 0;
    weapon.damage = "";
    weapon.range = "";
    weapon.attacks = "";
    weapon.elastic = "";
    weapon.failure = "";
    weapon.nameEditable = true;
    weapon.editable = true;
    initWeapon(weapon);
    investigator.weapons.push(weapon);

    viewUpdate(true);
}
function updateWeapon(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/weapon-(\w+)-(\w+)/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var prop = matches[2];
    var weapon = investigator.weapons.find((v) => v.id === id);
    if (path[0].type == "text") {
        eval("weapon." + prop + '="' + $("#weapon-" + id + "-" + prop)[0].value + '"');
    } else if (path[0].type == "number") {
        eval("weapon." + prop + "=" + emptyBy($("#weapon-" + id + "-" + prop)[0].value, "0"));
    }

    viewUpdate(true);
}
function deleteWeapon(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = (path[0].id + path[1].id).trim().match(/weapon-(\w+)-delete/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var index;
    var found = investigator.weapons.some(function (weapon, i) {
        index = i;
        return weapon.id == id;
    });

    if (!found) return;

    $("#weapon-" + investigator.weapons[index].id + "-row-1").remove();
    $("#weapon-" + investigator.weapons[index].id + "-row-2").remove();
    investigator.weapons.splice(index, 1);

    viewUpdate(true);
}
function ToWeaponTr(weapon) {
    var nameEditableDisabledProp = weapon.nameEditable ? "" : " disabled";
    var editableDisabledProp = weapon.editable ? "" : " disabled";
    var name = '<td rowspan="2"><div class="ui fluid input"><input id="weapon-' + weapon.getNameId() + '" class="no-spin" type="text" value="' + weapon.name + '"' + nameEditableDisabledProp + " /></div></td>";
    var rate = '<td><div class="ui fluid input"><input id="weapon-' + weapon.getRateId() + '" class="no-spin" type="number" value="' + weapon.rate + '" /></div></td>';
    var rateSkill = '<td colspan="4"><div id="weapon-' + weapon.id + '-rate-skill" class="ui weapon fluid selection dropdown' + editableDisabledProp + '" style="padding: 11px 5px;"><input id="weapon-' + weapon.id + '-rate-skill-value" type="hidden"/><i class="dropdown icon"></i><div class="default text"></div><div class="menu"></div></div></td>';
    var deleteButtonTd = '<td rowspan="2"><button id="weapon-' + weapon.id + '-delete" class="ui compact basic negative icon button"' + editableDisabledProp + '><i class="close icon"></i></button></td>';

    var damage = '<td><div class="ui fluid input"><input id="weapon-' + weapon.getDamageId() + '" class="no-spin" type="text" value="' + weapon.damage + '" /></div></td>';
    var range = '<td><div class="ui fluid input"><input id="weapon-' + weapon.getRangeId() + '" class="ui right aligned" type="text" value="' + weapon.range + '" /></div></td>';
    var attacks = '<td><div class="ui fluid input"><input id="weapon-' + weapon.getAttacksId() + '" class="ui right aligned" type="text" value="' + weapon.attacks + '" /></div></td>';
    var elastic = '<td><div class="ui fluid input"><input id="weapon-' + weapon.getElasticId() + '" class="no-spin" type="number" value="' + weapon.elastic + '" /></div></td>';
    var failure = '<td><div class="ui fluid input"><input id="weapon-' + weapon.getFailureId() + '" class="no-spin" type="number" value="' + weapon.failure + '" /></div></td>';

    var tr1 = '<tr id="weapon-' + weapon.id + '-row-1">' + name + rate + rateSkill + deleteButtonTd + "</tr>";
    var tr2 = '<tr id="weapon-' + weapon.id + '-row-2">' + damage + range + attacks + elastic + failure + "</tr>";

    return tr1 + tr2;
}

function initEquip(equip) {
    equip.getNameId = function () {
        return this.id + "-name";
    };
    equip.getPriceId = function () {
        return this.id + "-price";
    };
    equip.getQuantityId = function () {
        return this.id + "-quantity";
    };
    equip.getTotalPriceId = function () {
        return this.id + "-total-price";
    };
    equip.getDescriptionId = function () {
        return this.id + "-description";
    };
    equip.getDeleteButtonId = function () {
        return this.id + "-delete";
    };

    $("#equip-table").append(ToEquipTr(equip));
    $("#equip-" + equip.getNameId())[0].addEventListener("input", updateEquip);
    $("#equip-" + equip.getPriceId())[0].addEventListener("input", updateEquip);
    $("#equip-" + equip.getQuantityId())[0].addEventListener("input", updateEquip);
    $("#equip-" + equip.getDescriptionId())[0].addEventListener("input", updateEquip);
    $("#equip-" + equip.id + "-delete")[0].addEventListener("click", deleteEquip);
}
function appendEquip(e) {
    var equip = new Object();
    equip.category = "equip";
    equip.id = investigator.getMaxEquipId() + 1;
    equip.name = "";
    equip.price = 0;
    equip.quantity = "";
    equip.description = "";
    equip.editable = true;
    initEquip(equip);
    investigator.equips.push(equip);

    viewUpdate(true);
}
function updateEquip(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/equip-(\w+)-(\w+)/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var prop = matches[2];
    var equip = investigator.equips.find((v) => v.id === id);
    if (path[0].type == "text") {
        eval("equip." + prop + '="' + $("#equip-" + id + "-" + prop)[0].value + '"');
    } else if (path[0].type == "number") {
        eval("equip." + prop + "=" + emptyBy($("#equip-" + id + "-" + prop)[0].value, "0"));
    }

    viewUpdate(true);
}
function deleteEquip(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = (path[0].id + path[1].id).trim().match(/equip-(\w+)-delete/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var index;
    var found = investigator.equips.some(function (equip, i) {
        index = i;
        return equip.id == id;
    });

    if (!found) return;

    $("#equip-" + investigator.equips[index].id + "-row").remove();
    investigator.equips.splice(index, 1);

    viewUpdate(true);
}
function ToEquipTr(equip) {
    var disabledProp = equip.editable ? "" : " disabled";
    var name = '<td><div class="ui fluid input"><input id="equip-' + equip.getNameId() + '" class="no-spin" type="text" value="' + equip.name + '" /></div></td>';
    var price = '<td><div class="ui fluid input"><input id="equip-' + equip.getPriceId() + '" class="no-spin" type="number" value="' + equip.price + '" /></div></td>';
    var quantity = '<td><div class="ui fluid input"><input id="equip-' + equip.getQuantityId() + '" class="no-spin" type="number" value="' + equip.quantity + '" /></div></td>';
    var totalPrice = '<td><div class="ui fluid input"><input id="equip-' + equip.getTotalPriceId() + '" class="no-spin" type="number" value="' + equip.quantity * equip.price + '" disabled /></div></td>';
    var description = '<td><div class="ui fluid input"><input id="equip-' + equip.getDescriptionId() + '" class="no-spin" type="text" value="' + equip.description + '" /></div></td>';
    var deleteButtonTd = '<td><button id="equip-' + equip.id + '-delete" class="ui compact basic negative icon button"' + disabledProp + '><i class="close icon"></i></button></td>';
    return '<tr id="equip-' + equip.id + '-row">' + name + price + quantity + totalPrice + description + deleteButtonTd + "</tr>";
}

function initMoney(money) {
    $("#money-pocket")[0].value = money.pocket;
    $("#money-cash")[0].value = money.cash;
    $("#money-assets")[0].value = money.assets;

    $("#money-pocket")[0].addEventListener("input", updateMoney);
    $("#money-cash")[0].addEventListener("input", updateMoney);
    $("#money-assets")[0].addEventListener("input", updateMoney);
}
function updateMoney(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/money-(\w+)/);
    if (matches == null) return;
    var prop = matches[1];
    eval("investigator.money." + prop + '="' + $("#money-" + prop)[0].value + '"');

    viewUpdate(true);
}

function initBackstory(backstory) {
    $("#backstory-personalDescription")[0].value = backstory.personalDescription;
    $("#backstory-ideologyOrBeliefs")[0].value = backstory.ideologyOrBeliefs;
    $("#backstory-significantPeople")[0].value = backstory.significantPeople;
    $("#backstory-meaningfulLocations")[0].value = backstory.meaningfulLocations;
    $("#backstory-treasuredPossessions")[0].value = backstory.treasuredPossessions;
    $("#backstory-traits")[0].value = backstory.traits;
    $("#backstory-injuriesAndScars")[0].value = backstory.injuriesAndScars;
    $("#backstory-phobiasAndManias")[0].value = backstory.phobiasAndManias;
    $("#backstory-spellsAndArtifacts")[0].value = backstory.spellsAndArtifacts;
    $("#backstory-encounters")[0].value = backstory.encounters;

    $("#backstory-personalDescription")[0].addEventListener("input", updateBackstory);
    $("#backstory-ideologyOrBeliefs")[0].addEventListener("input", updateBackstory);
    $("#backstory-significantPeople")[0].addEventListener("input", updateBackstory);
    $("#backstory-meaningfulLocations")[0].addEventListener("input", updateBackstory);
    $("#backstory-treasuredPossessions")[0].addEventListener("input", updateBackstory);
    $("#backstory-traits")[0].addEventListener("input", updateBackstory);
    $("#backstory-injuriesAndScars")[0].addEventListener("input", updateBackstory);
    $("#backstory-phobiasAndManias")[0].addEventListener("input", updateBackstory);
    $("#backstory-spellsAndArtifacts")[0].addEventListener("input", updateBackstory);
    $("#backstory-encounters")[0].addEventListener("input", updateBackstory);

    if (!backstory.personalDescriptionkeyed) backstory.personalDescriptionkeyed = false;
    $("#backstory-key-personalDescription")[0].checked = backstory.personalDescriptionkeyed;
    $("#backstory-key-personalDescription")[0].addEventListener("change", function (e) {
        investigator.backstory.personalDescriptionkeyed = $("#backstory-key-personalDescription")[0].checked;
    });
    if (!backstory.ideologyOrBeliefskeyed) backstory.ideologyOrBeliefskeyed = false;
    $("#backstory-key-ideologyOrBeliefs")[0].checked = backstory.ideologyOrBeliefskeyed;
    $("#backstory-key-ideologyOrBeliefs")[0].addEventListener("change", function (e) {
        investigator.backstory.ideologyOrBeliefskeyed = $("#backstory-key-ideologyOrBeliefs")[0].checked;
    });
    if (!backstory.significantPeoplekeyed) backstory.significantPeoplekeyed = false;
    $("#backstory-key-significantPeople")[0].checked = backstory.significantPeoplekeyed;
    $("#backstory-key-significantPeople")[0].addEventListener("change", function (e) {
        investigator.backstory.significantPeoplekeyed = $("#backstory-key-significantPeople")[0].checked;
    });
    if (!backstory.meaningfulLocationskeyed) backstory.meaningfulLocationskeyed = false;
    $("#backstory-key-meaningfulLocations")[0].checked = backstory.meaningfulLocationskeyed;
    $("#backstory-key-meaningfulLocations")[0].addEventListener("change", function (e) {
        investigator.backstory.meaningfulLocationskeyed = $("#backstory-key-meaningfulLocations")[0].checked;
    });
    if (!backstory.treasuredPossessionskeyed) backstory.treasuredPossessionskeyed = false;
    $("#backstory-key-treasuredPossessions")[0].checked = backstory.treasuredPossessionskeyed;
    $("#backstory-key-treasuredPossessions")[0].addEventListener("change", function (e) {
        investigator.backstory.treasuredPossessionskeyed = $("#backstory-key-treasuredPossessions")[0].checked;
    });
    if (!backstory.traitskeyed) backstory.traitskeyed = false;
    $("#backstory-key-traits")[0].checked = backstory.traitskeyed;
    $("#backstory-key-traits")[0].addEventListener("change", function (e) {
        investigator.backstory.traitskeyed = $("#backstory-key-traits")[0].checked;
    });

    $("#randam-generate-backstory").on("click", function () {
        getRandomRandomPersonalDescription();
        getRandomIdeologyOrBeliefs();
        getRandomSignificantPeople();
        getRandomMeaningfulLocations();
        gatRandomTreasuredPossessions();
        getRandomTraits();
    });
    $("#randam-generate-backstory-personalDescription").on("click", function () {
        getRandomRandomPersonalDescription();
    });
    $("#randam-generate-backstory-ideologyOrBeliefs").on("click", function () {
        getRandomIdeologyOrBeliefs();
    });
    $("#randam-generate-backstory-significantPeople").on("click", function () {
        getRandomSignificantPeople();
    });
    $("#randam-generate-backstory-meaningfulLocations").on("click", function () {
        getRandomMeaningfulLocations();
    });
    $("#randam-generate-backstory-treasuredPossessions").on("click", function () {
        gatRandomTreasuredPossessions();
    });
    $("#randam-generate-backstory-traits").on("click", function () {
        getRandomTraits();
    });
    $("#append-backstory-phobia").on("click", function () {
        getRandomPhobia();
    });
    $("#append-backstory-mania").on("click", function () {
        getRandomMania();
    });
}
function updateBackstory(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    var matches = path[0].id.match(/backstory-(\w+)/);
    if (matches == null) return;
    var prop = matches[1];
    var value = $("#backstory-" + prop)[0].value;
    eval("investigator.backstory." + prop + "= value;");

    viewUpdate(true);
}
function getRandomRandomPersonalDescription() {
    var personalDescriptions = ["いかつい", "ずんぐり", "学者ふう", "童顔", "がっしりした", "だらしない", "輝かしい", "肉付きがいい", "かわいい", "だるそう", "筋肉質", "日焼けした", "きたならしい", "ばらのよう", "屈強", "不愛想", "きゃしゃ", "ハンサム", "若々しい", "不器用", "さえない", "ぶかっこう", "小肥り", "平凡", "しわくちゃ", "ぼんやりした", "上品", "魅力的", "スマート", "陰気", "青白い", "毛深い", "スリム", "汚い", "線の鋭い", "ひ弱"];
    investigator.backstory.personalDescription = personalDescriptions[dice(personalDescriptions.length) - 1];
    $("#backstory-personalDescription")[0].value = investigator.backstory.personalDescription;
}
function getRandomIdeologyOrBeliefs() {
    var ideologyOrBeliefs = [
        "あなたには崇拝して祈りをささげる崇高な存在(ビシュヌ、イエス、ハイレ・セラシエ1世など)がある。",
        "人類は宗教(頑固な無神論者、人道主義者、世谷主義者など)なしでやっていける。",
        "科学にはすべての答えがある。興味がある特定の分野(進化、低温物理学、宇宙探査など)を選ぶ。",
        "運命(カルマ、階級制度、迷信など)への信念。",
        "社会あるいは秘密結社(フリーメイソン、婦人会、匿名の組織など)の一員である。",
        "社会には根絶すべき悪がある。この悪とは何か？（ドラッグ、暴力、人種差別など)",
        "オカルト(占星術、スピリチュアリズム、タロットなど）",
        "政治(保守派、社会主義、リベラルなど)。",
        "「お金は力であり、得られるものはすべて得るつもだ」(貪欲、野心的、無慈悲など)。",
        "運動員/活動家(フェミニズム、平等の権利、組合の力など)。",
    ];
    investigator.backstory.ideologyOrBeliefs = ideologyOrBeliefs[dice(ideologyOrBeliefs.length) - 1];
    $("#backstory-ideologyOrBeliefs")[0].value = investigator.backstory.ideologyOrBeliefs;
}
function getRandomSignificantPeople() {
    var significantPeople = [
        "親(母親、父親、継母など)。",
        "祖父母(母方の祖母、父方の祖父など)。",
        "兄弟姉妹(兄弟、異母または異父兄弟、継姉妹など)。",
        "子供(息子か娘)。",
        "パートナー(配偶者、婚約者、恋人など)。",
        "探索者の最も高い職業技能を教えてくれた人。技能を特定し、誰が教えたのか考える(学校教師、師匠、父親など)。",
        "幼なじみ(級友、隣人、架空の友人など)。",
        "有名人。あなたのアイドルか英雄。一度も会ったことがないこともありうる(映画スター、政治家、ミュージシャンなど)。",
        "ゲームにおける仲間の探索者。誰か1人を選ぶかランダムに決める。",
        "ゲームにおけるノンプレイヤーキャラクター(NPC)。キーパーが1人選ぶ。",
    ];
    var whyPeopleSignificant = [
        "彼らの世話になっている。彼らはどのようにあなたを助けていたのか?(財政的に、苦しい時期の間あなたを保護した、あなたの最初の仕事を世話したなど)。",
        "彼らは何かをあなたに教えてくれた。それは何か?(技能、愛すること、人としてあるべきことなど)。",
        "彼らはあなたに人生の意味を与えてくれた。どのように?(あなたは彼らのようになることを切望している、あなたは彼らと共にいようと努力している、あなたは彼らを幸福にしようとしているなど)。",
        "あなたは彼らを不当に扱い、和解を求めている。あなたは何をしたのか?(彼らからお金を盗んだ、彼らを警察に通報した、彼らが窮地に陥っている時に助けを断ったなど)。",
        "経験を共有している。どんな?(厳しい時代を共に生きた、共に成長した、共に従軍したなど)。",
        "あなたは自分を彼らに認めてもらいたいと思っている。どのように?(良い仕事を得る、良い配偶者を見つける、教育を受けるなど)。",
        "彼らを偶像化している(彼らの名声、美、仕事など)。",
        "後悔(あなたは彼らの代わりに死ぬべきであった、あなたが言ったことのせいで仲たがいした、機会があったのに手を伸ばして彼らを助けなかったなど)。",
        "あなたは、自分が彼らより優れていることを証明したいと思っている。彼らの欠点は何であったか?(怠惰、飲酒癖、愛情の欠如など)。",
        "彼らはあなたのじゃまをした。「あなたはそれに復讐したいと思っている。あなたは何を彼らのせいにしているのか?(愛する人の死、破産、結婚生活の破たんなど)。",
    ];
    investigator.backstory.significantPeople = significantPeople[dice(significantPeople.length) - 1] + "\n" + whyPeopleSignificant[dice(whyPeopleSignificant.length) - 1];
    $("#backstory-significantPeople")[0].value = investigator.backstory.significantPeople;
}
function getRandomMeaningfulLocations() {
    var meaningfulLocations = [
        "あなたの学び舎(学校や大学など)。",
        "あなたの故郷(農村、地方都市、にぎやかな都市など)。",
        "あなたの初恋の場所(音楽コンサート、休日過ごした場所、防空壕など)。",
        "落ち着いた、熟考できる場所(図書館、あなたの地所の散歩道、釣りなど)。",
        "社交的な場所(紳土クラブ、地元のバー、おじの家)。",
        "あなたの「イデオロギー/信念」に関連する場所(教区の教会、メッカ、ストーンヘンジなど)。",
        "重要な人々の墓。誰のものか?(親、子供、恋人など)。",
        "あなたの実家(田舎の屋敷、賃貸アパート、あなたが育てられた孤児院など)。",
        "人生であなたが最も幸福であった場所(あなたが最初にキスした公園のベンチ、あなたの大学など)。",
        "あなたの仕事場(オフィス、図書館 銀行など)",
    ];
    investigator.backstory.meaningfulLocations = meaningfulLocations[dice(meaningfulLocations.length) - 1];
    $("#backstory-meaningfulLocations")[0].value = investigator.backstory.meaningfulLocations;
}
function gatRandomTreasuredPossessions() {
    var treasuredPossessions = [
        "あなたの最も高い技能に関連したアイテム(高価なスーツ、にせの身分証明、ブラスナックルなど)。",
        "あなたの職業にとって不可欠なアイテム(往診かばん、車、鍵開け道具など)。",
        "あなたの幼年期の思い出の品(コミック、折り畳みナイフ、幸運のコインなど)。",
        "去って行った人物の形見(宝石、あなたの財布に忍ばせた写真、手紙など)。",
        "あなたの重要な人々にあげた何か(指輪、日誌、地図など)。",
        "あなたのコレクション。それは何か?(バスの乗車券、ぬいぐるみ、レコードなど)。",
        "あなたが見つけた何か。ただし、あなたはそれが何で",
        "スポーツ用具(クリケット用バット、サイン入りの野球ボール、釣竿など)。",
        "武器(古い拳銃、あなたの古い猟銃、あなたのブーツに隠したナイフなど)。",
        "ペット(犬、猫、亀)。",
    ];
    investigator.backstory.treasuredPossessions = treasuredPossessions[dice(treasuredPossessions.length) - 1];
    $("#backstory-treasuredPossessions")[0].value = investigator.backstory.treasuredPossessions;
}
function getRandomTraits() {
    var traits = [
        "寛大(チップをはずむ、困っている人をいつも助ける、慈善家など)。",
        "動物に懐かれやすい(猫好き、農場育ち、馬に懐かれやすいなど)。",
        "夢見る人(想像が飛躍しがち、空想家、非常に創造的など）。",
        "快楽主義者(パーティーが生きがい、陽気に酔う生き急ぐなど)。",
        "ギャンプラーおよび冒険家(ポーカーフェイス、何でも一度試してみる、危険と隣り合わせの人生など)。",
        "料理が上手(素晴らしいケーキを焼く、ほとんど何もないところから食事を作る、舌が肥えているなど)。",
        "色男/男たらし(人当たりが良い、魅力的な声、魅惑的な目など)。",
        "忠誠心が強い(友人を助ける、決して約束を違えない。信念のために死んでもよいなど)。",
        "良い評判(その地方で最高のテーブルスピーチの最も敬度な人間、危険に際しても恐れを知らないなど)。",
        "野心的(目的を達成したい、ボスになりたい、すべてを手に入れたいなど)。",
    ];
    investigator.backstory.traits = traits[dice(traits.length) - 1];
    $("#backstory-traits")[0].value = investigator.backstory.traits;
}
function getRandomPhobia() {
    var phobias = [
        "入浴恐怖症:体、手、顔を洗うのが怖い",
        "高所恐怖症:高いところが怖い",
        "飛行恐怖症:飛ぶのが怖い",
        "広場恐怖症:広場、公共の(混雑した)場所が怖い",
        "鶏肉恐怖症:鶏肉が怖い",
        "ニンニク恐怖症:ニンニクが怖い",
        "乗車恐怖症:車両の中にいたり車両に乗るのが怖い",
        "風恐怖症:風が怖い",
        "男性恐怖症:男性が怖い",
        "イングランド恐怖症:イングランド、もしくはイングランド文化などが怖い",
        "花恐怖症:花が怖い",
        "切断恐怖症:手足や指などが切断された人が怖い",
        "クモ恐怖症:クモが怖い",
        "稲妻恐怖症: 稲妻が怖い",
        "廃墟恐怖症:廃墟が怖い",
        "笛恐怖症:笛(フルート)が怖い",
        "細菌恐怖症:細菌、バクテリアが怖い",
        "銃弾恐怖症:投擲物や銃弾が怖い",
        "落下恐怖症:落下が怖い",
        "書物恐怖症:本が怖い",
        "植物恐怖症:植物が怖い",
        "美女恐怖症:美しい女性が怖い",
        "低温恐怖症:冷たいものが怖い",
        "時計恐怖症:時計が怖い",
        "閉所恐怖症:壁に囲まれた場所が怖い",
        "道化師恐怖症:道化師が怖い",
        "犬恐怖症:犬が怖い",
        "悪魔恐怖症:悪魔が怖い",
        "群集恐怖症:人混みが怖い",
        "歯科医恐怖症:歯科医が怖い",
        "処分恐怖症:ものを捨てるのが怖い(ため込み症)",
        "毛皮恐怖症:毛皮が怖い",
        "横断恐怖症:道路を横断するのが怖い",
        "教会恐怖症:教会が怖い",
        "鏡恐怖症:鏡が怖い",
        "ピン恐怖症:針やピンが怖い",
        "昆虫恐怖症:昆虫が怖い",
        "猫恐怖症:猫が怖い",
        "橋恐怖症:橋を渡るのが怖い",
        "老人恐怖症:老人や歳をとることが怖い",
        "女性恐怖症:女性が怖い",
        "血液恐怖症:血が怖い",
        "加湿恐怖症:失敗が怖い",
        "接触恐怖症:触れることが怖い",
        "爬虫類恐怖症:爬虫類が怖い",
        "霧恐怖症:霧が怖い",
        "銃器恐怖症:銃器が怖い",
        "水恐怖症:水が怖い",
        "睡眠恐怖症:眠ったり、催眠状態に陥るのが怖い",
        "医師恐怖症:医師が怖い",
        "魚恐怖症:魚が怖い",
        "ゴキブリ恐怖症:ゴキブリが怖い",
        "雷鳴恐怖症:雷鳴が怖い",
        "野菜恐怖症:野菜が怖い",
        "大騒音恐怖症:大騒音が怖い",
        "湖恐怖症:湖が怖い",
        "機械恐怖症:機械や装置が怖い",
        "巨大物恐怖症:巨大なものが怖い",
        "拘束恐怖症:縛られたり結びつけられたりするのが怖い",
        "隕石恐怖症:流星や隕石が怖い",
        "孤独恐怖症:ひとりでいることが怖い",
        "汚染恐怖症:汚れたり汚染されたりするのが怖い",
        "粘液恐怖症:粘液、粘体が怖い",
        "死体恐怖症:死体が怖い",
        "8恐怖症:8の数字が怖い",
        "歯恐怖症:歯が怖い",
        "夢恐怖症:夢が怖い",
        "名称恐怖症:特定の言葉(1つまたは複数)を聞くのが怖い",
        "蛇恐怖症:ヘビが怖い",
        "鳥恐怖症:鳥が怖い",
        "寄生生物恐怖症:寄生生物が怖い",
        "人形恐怖症:人形が怖い",
        "恐食症:飲み込むこと、食べること、もしくは食べられることが怖い",
        "薬物恐怖症:薬物が怖い",
        "幽霊恐怖症:幽霊が怖い",
        "羞明:日光が怖い",
        "ヒゲ恐怖症:ヒゲが怖い",
        "河川恐怖症:川が怖い",
        "アルコール恐怖症:アルコールやアルコール飲料が怖い",
        "火恐怖症:火が怖い",
        "杖恐怖症:魔術が怖い",
        "暗闇恐怖症:暗闇や夜が怖い",
        "月恐怖症:月が怖い",
        "鉄道恐怖症:列車の旅が怖い",
        "星恐怖症:星が怖い",
        "狭所恐怖症:狭いもの屋場所が怖い",
        "対称恐怖症:左右対称が怖い",
        "生き埋め恐怖症:生き埋めになることや墓地が怖い",
        "雄牛恐怖症:雄牛が怖い",
        "電話恐怖症:電話が怖い",
        "奇形恐怖症:怪物が怖い",
        "海洋恐怖症:海が怖い",
        "手術恐怖症:外科手術が怖い",
        "13恐怖症:13の数字が怖い",
        "衣服恐怖症:衣服が怖い",
        "魔女恐怖症:魔女と魔術が怖い",
        "黄色恐怖症:黄色や「黄色」という言葉が怖い",
        "外国語恐怖症:外国語が怖い",
        "外国人恐怖症:外国人が怖い",
        "動物恐怖症:動物が怖い",
    ];

    investigator.backstory.phobiasAndManias += phobias[dice(phobias.length) - 1] + "\n";
    $("#backstory-phobiasAndManias")[0].value = investigator.backstory.phobiasAndManias;
}
function getRandomMania() {
    var manias = [
        "洗浄マニア:自分の体を洗わずにはいられない(肉体的)",
        "無為マニア:病的な優柔不断(精神的)",
        "暗黒マニア:暗黒に関する過度の嗜好(知的)",
        "高所マニア:高い場所に登らずにはいられない(肉体的)",
        "善良マニア:病的な親切(精神的)",
        "広場マニア:開けた場所にいたいと言う激しい願望(精神的)",
        "先鋭マニア:鋭いもの、尖ったものへの執着(精神的)",
        "猫マニア:猫に関する異常な愛好心(物質的)",
        "疼痛性愛:痛みへの執着(精神的)",
        "ニンニクマニア:ニンニクへの執着(物質的)",
        "乗り物マニア:車の中にいることへの執着(精神的)",
        "病的快活:不合理な朗らかさ(精神的)",
        "花マニア:花への執着(物質的)",
        "計算マニア:数への偏執的な没頭(精神的)",
        "浪費マニア:衝動的あるいは無謀な浪費(精神的)",
        "自己マニア:孤独への過度の嗜好(精神的)",
        "バレエマニア:バレエに関する異常な愛好心(知的)",
        "書籍窃盗癖:本を盗みたいと言う強迫的衝動(肉体的)",
        "書物マニア:本または読書、あるいはその両方への執着(知的)",
        "歯ぎしりマニア:歯ぎしりしたいと言う強迫的衝動(肉体的)",
        "悪霊マニア:誰かの中に邪悪な精霊がいるという病的な信念(精神的)",
        "自己愛マニア:自分自身の美への執着(精神的)",
        "地図マニア:いたる所の地図を見ることの制御不可能な強迫的衝動(知的)",
        "飛び降りマニア:高い場所から跳躍することへの執着(肉体)",
        "寒冷マニア:冷たさ、または冷たいもの、あるいはその両方への異常な欲望(精神的)",
        "舞踏マニア:踊ることへの愛好もしくは制御不可能な熱狂(肉体的)",
        "睡眠マニア:寝ることへの過度の願望(精神的)",
        "墓地マニア:墓地への執着(物質的)",
        "色彩マニア:特定の色への執着(物質的)",
        "ピエロマニア:ピエロへの執着(物質的)",
        "遭遇マニア:恐ろしい状況を経験したいと言う強迫的衝動(精神的)",
        "殺害マニア:殺害への執着(肉体的)",
        "悪魔マニア:誰かが悪魔にとりつかれているという病的な信念(精神的)",
        "皮膚マニア:人の皮膚を引っ張りたいと言う強迫的衝動(肉体的)",
        "正義マニア:正義が完遂されるのを見たいという執着(精神的)",
        "アルコールマニア:アルコールに関する異常な欲求(精神的)",
        "毛皮マニア:毛皮を所有することへの執着(物質的)",
        "贈り物マニア:贈り物を与えることへの執着(精神的)",
        "逃走マニア:逃走することへの強迫的衝動(肉体的)",
        "外出マニア:外を歩きまわることへの強迫的衝動(肉体的)",
        "自己中心マニア:不合理な自己中心の態度が自己崇拝(精神的)",
        "公職マニア:公的な職業につきたいと言う強欲な衝動(精神的)",
        "戦慄マニア:誰かが罪を犯したと言う病的な信念(精神的)",
        "知識マニア:知識を得ることへの執着(知的)",
        "静寂マニア:静寂であることへの強迫的衝動(精神的)",
        "エーテルマニア:エーテルへの切望(知的)",
        "求婚マニア:奇妙な求婚をすることへの執着(肉体的)",
        "笑いマニア:営業不可能な笑うことへの強迫的衝動(肉体的)",
        "魔術マニア:魔女と魔術への執着(知的)",
        "筆記マニア:全てを書き留めることへの執着(肉体的)",
        "裸体マニア:裸になりたいという強迫的衝動(肉体的)",
        "幻想マニア:快い幻想(現実とは関係なく)にとらわれやすい異常な傾向(精神的)",
        "蟲マニア:蟲に関する過度の嗜好(知的)",
        "火器マニア:火器への執着(知的)",
        "水マニア:水に関する不合理な渇望(物質的)",
        "魚マニア:魚への執着(物質的)",
        "アイコンマニア:像や肖像への執着(物質的)",
        "アイドルマニア:偶像への執着または献身(精神的)",
        "情報マニア:事実を集めることへの過度の献身(知的)",
        "絶叫マニア:叫ぶことへの説明できない強迫的衝動(肉体的)",
        "窃盗マニア:盗むことへの説明できない強迫的衝動(肉体的)",
        "騒音マニア:大きなあるいは甲高い騒音を出すことへの制御不可能な強迫的衝動(肉体的)",
        "ひもマニア:ひもへの執着(物質的)",
        "宝くじマニア:宝くじに参加したいという極度の願望(肉体的)",
        "鬱マニア:非常に深くふさぎ込む傾向(精神的)",
        "巨石マニア:環状列石/立石があると奇妙な考えにとらわれる異常な傾向(知的)",
        "音楽マニア:音楽もしくは特定の旋律への執着(知的)",
        "作詞マニア:詞を書くことへの強欲な願望(知的)",
        "憎悪マニア:何らかの対象あるいはグループの何もかもを憎む執着(精神的)",
        "偏執マニア:ただ1つの思想やアイディアへの異常な執着(知的)",
        "虚言マニア:異常なほどに嘘をついたり誇張して話す(肉体的)",
        "疾病マニア:想像上の病気に苦しめられる幻想(精神的)",
        "記録マニア:あらゆるものを記録に残そうと言う強迫的衝動(肉体的)",
        "名前マニア:人々、場所、物などの名前の執着(知的)",
        "単語マニア:ある単語を繰り返したいと言う抑え切れない欲求(精神的)",
        "爪損傷マニア:指の爪をむしったりはがそうとする強迫的衝動(肉体)",
        "美食マニア:1種類の食物への異常な愛(精神的)",
        "不平マニア:不平を言うことへの異常な喜び(肉体的)",
        "仮面マニア:仮面や覆面をつけたいと言う強迫的衝動(肉体的)",
        "幽霊マニア:幽霊への執着(知的)",
        "殺人マニア:殺人への病的な傾向(肉体的)",
        "光線マニア:光の病的な願望(精神的)",
        "放浪マニア:社会の規範に背きたいと言う異常な欲望(肉体的)",
        "長者マニア:富への強迫的な欲望(物質的)",
        "病的虚言マニア:嘘をつきたくてたまらない強迫的衝動(肉体的)",
        "放火マニア:火をつけることへの強迫的衝動(肉体的)",
        "質問マニア:質問したいという激しい強迫的衝動(肉体的)",
        "鼻マニア:鼻をいじりたいという強迫的衝動(肉体的)",
        "落書きマニア:いたずら書きや落書きへの執着(肉体的)",
        "列車マニア:列車と鉄道旅行への強い魅了(知的)",
        "知性マニア:彼が信じられないほど知的であるという幻想(精神的)",
        "テクノマニア:新技術への執着(知的)",
        "タナトスマニア:誰かが私を招く魔術によって呪われているという信念(精神的)",
        "宗教マニア:その人が神であると言う信仰(精神的)",
        "かき傷マニア:かき傷をつけることへの強迫的衝動(肉体的)",
        "手術マニア:外科手術を行うことへの不合理な嗜好(精神的)",
        "抜毛マニア:自分の上を引き抜くことへの切望(肉体的)",
        "失明マニア:病的な視覚障害(肉体的)",
        "異国マニア:外国のものへの執着(知的)",
        "動物マニア:動物への正気でない溺愛(精神的)",
    ];

    investigator.backstory.phobiasAndManias += manias[dice(manias.length) - 1] + "\n";
    $("#backstory-phobiasAndManias")[0].value = investigator.backstory.phobiasAndManias;
}
function viewUpdate(isSaveLocal) {
    $("#param-str-present")[0].value = investigator.parameter.str + investigator.parameter.strGrow;
    $("#param-con-present")[0].value = investigator.parameter.con + investigator.parameter.conGrow;
    $("#param-pow-present")[0].value = investigator.parameter.pow + investigator.parameter.powGrow;
    $("#param-dex-present")[0].value = investigator.parameter.dex + investigator.parameter.dexGrow;
    $("#param-app-present")[0].value = investigator.parameter.app + investigator.parameter.appGrow;
    $("#param-siz-present")[0].value = investigator.parameter.siz + investigator.parameter.sizGrow;
    $("#param-int-present")[0].value = investigator.parameter.int + investigator.parameter.intGrow;
    $("#param-edu-present")[0].value = investigator.parameter.edu + investigator.parameter.eduGrow;
    $("#param-luk-present")[0].value = investigator.parameter.luk + investigator.parameter.lukGrow;
    $("#param-ide")[0].value = investigator.parameter.getIde();
    $("#param-ide-present")[0].value = investigator.parameter.getIde() + investigator.parameter.ideGrow;
    $("#param-knw")[0].value = investigator.parameter.getKnw();
    $("#param-knw-present")[0].value = investigator.parameter.getKnw() + investigator.parameter.knwGrow;
    $("#param-hp")[0].value = investigator.parameter.getHp();
    $("#param-hp-present")[0].value = investigator.parameter.getHp() + investigator.parameter.hpGrow;
    $("#param-mp")[0].value = investigator.parameter.getMp();
    $("#param-mp-present")[0].value = investigator.parameter.getMp() + investigator.parameter.mpGrow;
    $("#param-san-indefinite")[0].innerText = parseInt(investigator.parameter.san * 0.8);
    $("#param-bld")[0].value = investigator.parameter.getBld();
    $("#param-db")[0].value = investigator.parameter.getDb();
    $("#param-mov")[0].value = investigator.parameter.getMov(investigator.profile.age);

    var jobPoints = investigator.parameter.jobPoints + investigator.parameter.jobPointsCorrection;
    $("#param-job-points-present")[0].value = investigator.parameter.jobPoints;

    var interestPoints = investigator.parameter.getInterestPoint() + investigator.parameter.interestPointsCorrection;
    $("#param-interest-points")[0].value = investigator.parameter.getInterestPoint();
    $("#param-interest-points-present")[0].value = interestPoints;

    investigator.skills[0].init = Math.floor((investigator.parameter.dex + investigator.parameter.dexGrow) / 2);
    $("#skill-0-init")[0].value = investigator.skills[0].init;

    investigator.skills[44].init = investigator.parameter.edu + investigator.parameter.eduGrow;
    $("#skill-44-init")[0].value = investigator.skills[44].init;

    var usageJobPoints = 0;
    var usageInterestPoints = 0;
    var weaponSkills = [];
    for (var i = 0; i < investigator.skills.length; i++) {
        var skill = investigator.skills[i];
        $("#skill-" + skill.getPresentId())[0].value = skill.init + skill.job + skill.interest + skill.grow + skill.other;

        usageJobPoints += skill.job;
        usageInterestPoints += skill.interest;

        if (skill.name == "近接戦闘" || skill.name == "射撃" || skill.name == "投擲") {
            weaponSkills.push({ name: skill.getFullname(), id: skill.id, value: skill.init + skill.job + skill.interest + skill.grow + skill.other });
        }
    }

    for (var i = 0; i < investigator.weapons.length; i++) {
        var weapon = investigator.weapons[i];
        var skillName = weapon.rateSkillName ? weapon.rateSkillName : "任意";
        var weaponValues = [];
        var prop = { name: "任意", value: i + "-any", selected: skillName == "任意" };
        weaponValues.push(prop);
        $("#weapon-" + weapon.id + "-rate").prop("disabled", !prop.selected);
        for (var j = 0; j < weaponSkills.length; j++) {
            var weaponSkill = weaponSkills[j];
            prop = { name: weaponSkill.name, value: i + "-" + j + "-" + weaponSkill.value, selected: weaponSkill.name == skillName };
            weaponValues.push(prop);
            if (prop.selected) {
                $("#weapon-" + weapon.id + "-rate")[0].value = weaponSkill.value;
            }
        }
        $("#weapon-" + weapon.id + "-rate-skill")
            .dropdown({ values: weaponValues })
            .dropdown({
                onChange: function (value, text, $selectedItem) {
                    viewUpdate(true);
                },
            });
    }

    for (var i = 0; i < investigator.equips.length; i++) {
        var equip = investigator.equips[i];
        $("#equip-" + equip.getTotalPriceId())[0].value = equip.price * equip.quantity;
    }

    var cthulhuSkill = investigator.skills[37];
    var cthulhuSkillPoint = cthulhuSkill.init + cthulhuSkill.job + cthulhuSkill.interest + cthulhuSkill.grow + cthulhuSkill.other;
    $("#param-san-limit")[0].innerText = `/${99 - cthulhuSkillPoint}`;

    var usageJobPointsElement = $("#param-job-points-usage");
    var usageInterestPointsElement = $("#param-interest-points-usage");
    if (usageJobPoints <= jobPoints) {
        usageJobPointsElement.addClass("blue");
        usageJobPointsElement.removeClass("red");
    } else {
        usageJobPointsElement.removeClass("blue");
        usageJobPointsElement.addClass("red");
    }
    if (usageInterestPoints <= interestPoints) {
        usageInterestPointsElement.addClass("blue");
        usageInterestPointsElement.removeClass("red");
    } else {
        usageInterestPointsElement.removeClass("blue");
        usageInterestPointsElement.addClass("red");
    }
    usageJobPointsElement[0].innerText = `職P ${usageJobPoints}/${jobPoints}[${jobPoints - usageJobPoints}]`;
    usageInterestPointsElement[0].innerText = `興P ${usageInterestPoints}/${interestPoints}[${interestPoints - usageInterestPoints}]`;

    console.log(isSaveLocal)
    if (isSaveLocal) {
        saveLocalInvestigator(investigator);
    }
}

function toHistoryCard(index, investigator) {
    var str = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">STR</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.str}</div></div></div>`;
    var con = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">CON</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.con}</div></div></div>`;
    var pow = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">POW</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.pow}</div></div></div>`;
    var dex = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">DEX</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.dex}</div></div></div>`;
    var app = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">APP</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.app}</div></div></div>`;
    var siz = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">SIZ</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.siz}</div></div></div>`;
    var int = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">INT</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.int}</div></div></div>`;
    var edu = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">EDU</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.edu}</div></div></div>`;
    var luk = `<div class="item" style="margin: 2px;"><div class="content"><div class="header">幸運</div><div class="description" style="padding: 1px!important;margin: 1px;">${investigator.parameter.luk}</div></div></div>`;
    var list = `<div class="ui large inverted horizontal list meta">${str}${con}${pow}${dex}${app}${siz}${int}${edu}${luk}</div>`;
    var content = `<div class="content" style="padding: 5px;"><div class="header">${investigator.profile.name}</div>${list}</div>`;
    var button = `<button id="history-investigator-${index}-load" class="ui fluid inverted positive basic button">読み込み</button>`;
    return `<div class="ui left aligned column" style="margin: 0!important;"><div class="ui fluid inverted card">${content}${button}</div></div>`;
}

window.onload = function () {
    initSigns();
    initAccount(account);
    initModal();

    initRandamGenerateParameter();
    initInitialSkills();
    initExport();
    initDiceRoll();

    $("#account-recommendation-close").on("click", function () {
        $("#account-recommendation").hide();
    });

    $("#account-recommendation-link").on("click", function () {
        $(".ui.account-sign-up").hide();
        $(".ui.account-sign-in").show();
        $(".ui.account.modal").modal({ duration: 200 }).modal("show");
    });

    $("#investigator-history")[0].addEventListener("click", function (e) {
        if (localInvestigators.length == 0) {
            localInvestigators = localStorage.localInvestigators ? JSON.parse(localStorage.localInvestigators) : [];
        }
        $("#history-investigators").empty();
        for (var i = localInvestigators.length - 1; i >= 0; i--) {
            var localInvestigator = localInvestigators[i];
            if (localInvestigator === investigator) continue;
            $("#history-investigators").append(toHistoryCard(i, localInvestigator));
            $("#history-investigator-" + i + "-load")[0].addEventListener("click", function (e) {
                var path = e.path || (e.composedPath && e.composedPath());
                var matches = path[0].id.match(/history-investigator-(\w+)-load/);
                if (matches == null) return;
                var index = matches[1];
                var id = investigator.id;
                investigator = override(JSON.parse(JSON.stringify(localInvestigators[index])));
                investigator.id = id;
                if (localInvestigators.length > 6) {
                    localInvestigators = localInvestigators.slice(localInvestigators.length - 6, -1);
                }
                localStorage.localInvestigators = JSON.stringify(localInvestigators);
                initInvestigator(investigator);
                $(".ui.history.modal").modal({ duration: 200 }).modal("hide");
            });
        }
        $(".ui.history.modal").modal({ duration: 200 }).modal("show");
    });

    $("#investigator-share")[0].addEventListener("click", function (e) {
        var uri = new URL(window.location.href);
        writeClipboard(uri.origin + "/sns?v=" + getParam("v"));
    });

    $("#investigator-view")[0].addEventListener("click", function (e) {
        window.location.href = "view?v=" + investigator.id;
    });

    $("#investigator-save")[0].addEventListener("click", function (e) {
        if (account.id == 0) return;
        saveEditingInvestigator(account, investigator, function (newId) {
            setParam("v", newId);
        });
    });

    $(".ui.dropdown").dropdown();
    $(".ui.skill.accordion").accordion({ exclusive: false });
    $(".ui.pointing.menu .item").tab();
    $(".ui.rating").rating();

    var paramV = parseInt(getParam("v"));
    getEditingInvestigator(account, paramV ? paramV : 0, function (newInvestigator) {
        investigator = newInvestigator;
        initInvestigator(investigator);
        viewUpdate(false);
    });
};

account = getLoginAccount();
investigator = {};
localInvestigators = [];
var paramV = parseInt(getParam("v"));
if (!paramV) {
    getNewInvestigator(account, function (newId) {
        setParam("v", newId);
    });
}
