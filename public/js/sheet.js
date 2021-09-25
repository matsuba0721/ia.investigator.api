function accountChanged(account) {
    getInvestigatorEditable(account, parseInt(getParam("v")), function (editable) {
        if (editable) {
            $("#investigator-save-menu").show();
            $("#upload-profile-image").prop("disabled", false);
        } else {
            $("#investigator-save-menu").hide();
            $("#upload-profile-image").prop("disabled", true);
        }
    });
}
function initRandamGenerateParameter() {
    $("#randam-generate-parameter").on("click", function () {
        ["str", "con", "pow", "dex", "app", "siz", "int", "edu", "luk"].forEach((param) => {
            $("#start-randam-generate-parametor").prop("disabled", false);
            $(`#${param}-randam-roll .dice`).each(function (index, element) {
                element.src = `/images/dice0.png`;
            });
            $(`#${param}-randam-result`)[0].innerText = "0";
        });
        $(".ui.mini.generate.modal").modal({ duration: 200 }).modal("show");
    });
    $("#start-randam-generate-parametor").on("click", function () {
        $("#str-randam-result")[0].innerText = "?";
        $("#start-randam-generate-parametor").prop("disabled", true);
        var rollTicks = 0;
        var intervalId = setInterval(() => {
            rollTicks += 1;
            ["str", "con", "pow", "dex", "app", "siz", "int", "edu", "luk"].forEach((param) => {
                var total = 0,
                    lastindex = 0;
                $(`#${param}-randam-roll .dice`).each(function (index, element) {
                    var num = dice(6);
                    element.src = `/images/dice${num}.png`;
                    total += num * 5;
                    lastindex = index;
                });
                if (lastindex < 2) total += 30;
                $(`#${param}-randam-result`)[0].innerText = total;
            });
            if (rollTicks > 10) {
                $("#start-randam-generate-parametor").prop("disabled", false);
                clearInterval(intervalId);
            }
        }, 50);
    });
    $("#set-randam-generate-parametor").on("click", function () {
        var parameter = investigator.parameter;
        parameter.str = parseInt($(`#str-randam-result`)[0].innerText);
        parameter.con = parseInt($(`#con-randam-result`)[0].innerText);
        parameter.pow = parseInt($(`#pow-randam-result`)[0].innerText);
        parameter.dex = parseInt($(`#dex-randam-result`)[0].innerText);
        parameter.app = parseInt($(`#app-randam-result`)[0].innerText);
        parameter.siz = parseInt($(`#siz-randam-result`)[0].innerText);
        parameter.int = parseInt($(`#int-randam-result`)[0].innerText);
        parameter.edu = parseInt($(`#edu-randam-result`)[0].innerText);
        parameter.luk = parseInt($(`#luk-randam-result`)[0].innerText);
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

        viewUpdate();
        $(".ui.mini.generate.modal").modal({ duration: 200 }).modal("hide");
    });
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
        viewUpdate();
    });
    $("#param-job-points")[0].addEventListener("input", function (e) {
        eval("investigator.parameter.jobPoints=" + emptyBy($("#param-job-points")[0].value, "0"));
        viewUpdate();
    });
    $("#param-job-points-correction")[0].addEventListener("input", function (e) {
        eval("investigator.parameter.jobPointsCorrection=" + emptyBy($("#param-job-points-correction")[0].value, "0"));
        viewUpdate();
    });
    $("#param-interest-points-correction")[0].addEventListener("input", function (e) {
        eval("investigator.parameter.interestPointsCorrection=" + emptyBy($("#param-interest-points-correction")[0].value, "0"));
        viewUpdate();
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

    console.log(investigator.isHidden);
    $("#isHidden")[0].checked = investigator.isHidden;
    $("#isHidden")[0].addEventListener("change", function (e) {
        investigator.isHidden = $("#isHidden")[0].checked;
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
    var matches = e.path[0].id.match(/profile-(\w+)/);
    if (matches == null) return;
    var prop = matches[1];
    eval("investigator.profile." + prop + '="' + $("#profile-" + prop)[0].value + '"');

    viewUpdate();
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
        viewUpdate();
    });
}
function updateParameter(e) {
    var prop = e.path[0].id.replace("param-", "").replace("-grow", "");
    eval("investigator.parameter." + prop + "=" + emptyBy($("#param-" + prop)[0].value, "0"));
    eval("investigator.parameter." + prop + "Grow=" + emptyBy($("#param-" + prop + "-grow")[0].value, "0"));
    $("#param-" + prop + "-present")[0].value = eval("investigator.parameter." + prop + "+" + "investigator.parameter." + prop + "Grow");

    viewUpdate();
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
    var matches = e.path[0].id.match(/append-skill-(\w+)/);
    var skill = createSkill(matches[1]);
    initSkill(skill);
    investigator.skills.push(skill);

    viewUpdate();
}
function appendSpecificSkill(e) {
    console.log(e);
    var matches = e.path[0].id.match(/append-skill-(\w+)/);
    var skill = createSkill(matches[1], e.path[0].value);
    initSkill(skill);
    investigator.skills.push(skill);

    viewUpdate();
}
function updateSkill(e) {
    var matches = e.path[0].id.match(/skill-(\w+)-(\w+)/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var prop = matches[2];
    var skill = investigator.skills.find((v) => v.id === id);
    if (e.path[0].type == "text") {
        eval("skill." + prop + '="' + $("#skill-" + id + "-" + prop)[0].value + '"');
    } else if (e.path[0].type == "number") {
        eval("skill." + prop + "=" + emptyBy($("#skill-" + id + "-" + prop)[0].value, "0"));
    }

    viewUpdate();
}
function deleteSkill(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/skill-(\w+)-delete/);
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

    viewUpdate();
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
        var matches = e.path[0].id.match(/weapon-(\w+)-rate-skill-value/);
        if (matches == null) return;
        var id = parseInt(matches[1]);

        matches = e.path[0].value.match(/(\d+)-\d+-(\d+)/);
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

    viewUpdate();
}
function updateWeapon(e) {
    var matches = e.path[0].id.match(/weapon-(\w+)-(\w+)/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var prop = matches[2];
    var weapon = investigator.weapons.find((v) => v.id === id);
    if (e.path[0].type == "text") {
        eval("weapon." + prop + '="' + $("#weapon-" + id + "-" + prop)[0].value + '"');
    } else if (e.path[0].type == "number") {
        eval("weapon." + prop + "=" + emptyBy($("#weapon-" + id + "-" + prop)[0].value, "0"));
    }

    viewUpdate();
}
function deleteWeapon(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/weapon-(\w+)-delete/);
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

    viewUpdate();
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

    viewUpdate();
}
function updateEquip(e) {
    var matches = e.path[0].id.match(/equip-(\w+)-(\w+)/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var prop = matches[2];
    var equip = investigator.equips.find((v) => v.id === id);
    if (e.path[0].type == "text") {
        eval("equip." + prop + '="' + $("#equip-" + id + "-" + prop)[0].value + '"');
    } else if (e.path[0].type == "number") {
        eval("equip." + prop + "=" + emptyBy($("#equip-" + id + "-" + prop)[0].value, "0"));
    }

    viewUpdate();
}
function deleteEquip(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/equip-(\w+)-delete/);
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

    viewUpdate();
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
    var matches = e.path[0].id.match(/money-(\w+)/);
    if (matches == null) return;
    var prop = matches[1];
    eval("investigator.money." + prop + '="' + $("#money-" + prop)[0].value + '"');

    viewUpdate();
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
}
function updateBackstory(e) {
    var matches = e.path[0].id.match(/backstory-(\w+)/);
    if (matches == null) return;
    var prop = matches[1];
    var value = $("#backstory-" + prop)[0].value;
    eval("investigator.backstory." + prop + "= value;");

    viewUpdate();
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
        "関大(チップをはずむ、困っている人をいつも助い",
        "動物に懐かれやすい(猫好き、農場育ち、馬に性 慈善家など)。",
        "夢見る人(想像が飛躍しがち、空想家、非常に創造的など）。",
        "快楽主義者(パーティーが生きがい、陽気に酔う行き急ぐなど)。",
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
function viewUpdate() {
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
                    viewUpdate();
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
    $(".ui.accordion").accordion({ exclusive: false });
    $(".ui.pointing.menu .item").tab();
    $(".ui.rating").rating();

    var paramV = parseInt(getParam("v"));
    getEditingInvestigator(account, paramV ? paramV : 0, function (newInvestigator) {
        investigator = newInvestigator;
        initInvestigator(investigator);
        viewUpdate();
    });
};

account = getLoginAccount();
investigator = {};
var paramV = parseInt(getParam("v"));
if (!paramV) {
    getNewInvestigator(account, function (newId) {
        setParam("v", newId);
    });
}
