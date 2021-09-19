function initInvestigator(investigator) {
    var cthulhuSkill = investigator.skills[37];

    initProfile(investigator.profile);
    initParameter(investigator.parameter, cthulhuSkill);

    $("#profile-image")[0].src = investigator.getProfileImagePath();

    for (var i = 0; i < investigator.skills.length; i++) {
        var skill = investigator.skills[i];
        if (skill.job + skill.interest + skill.grow + skill.other == 0) continue;
        $("#skills").append(toSkillItem(skill));
    }
    var weaponCount = 0;
    for (var i = 0; i < investigator.weapons.length; i++) {
        $("#weapons").append(toWeaponItem(investigator.weapons[i]));
        weaponCount++;
    }
    if (weaponCount == 0) {
        $("#weapons-table").hide();
    }
    var equipCount = 0;
    for (var i = 0; i < investigator.equips.length; i++) {
        $("#equips").append(toEquipItem(investigator.equips[i]));
        equipCount++;
    }
    if (equipCount == 0) {
        $("#equips-table").hide();
    }
    $("#money")[0].innerText = `支出レベル:${investigator.money.pocket} 現金:${investigator.money.cash} 資産:${investigator.money.assets}`;
    initBackstory(investigator.backstory);
    $("#memo")[0].innerText = investigator.memo;
}
function initProfile(profile) {
    $("#profile-name")[0].innerText = profile.name;
    $("#profile-kana")[0].innerText = profile.kana;
    $("#profile-job")[0].innerText = profile.job;
    $("#profile-age")[0].innerText = profile.age;
    $("#profile-gender")[0].innerText = profile.gender;
    $("#profile-height")[0].innerText = profile.height;
    $("#profile-weight")[0].innerText = profile.weight;
    $("#profile-origin")[0].innerText = profile.origin;
    $("#profile-hairColor")[0].innerText = profile.hairColor;
    $("#profile-eyeColor")[0].innerText = profile.eyeColor;
    $("#profile-skinColor")[0].innerText = profile.skinColor;
    var tagStr = profile.tag.trim();
    if (tagStr) {
        var tags = toTags(tagStr);
        for (var i = 0; i < tags.length; i++) {
            $("#profile-tag").append(`<div class="ui label">${tags[i]}</div>`);
        }
    }
}
function initParameter(parameter, cthulhuSkill) {
    $("#param-str")[0].innerText = parameter.str + parameter.strGrow;
    $("#param-con")[0].innerText = parameter.con + parameter.conGrow;
    $("#param-pow")[0].innerText = parameter.pow + parameter.powGrow;
    $("#param-dex")[0].innerText = parameter.dex + parameter.dexGrow;
    $("#param-app")[0].innerText = parameter.app + parameter.appGrow;
    $("#param-siz")[0].innerText = parameter.siz + parameter.sizGrow;
    $("#param-int")[0].innerText = parameter.int + parameter.intGrow;
    $("#param-edu")[0].innerText = parameter.edu + parameter.eduGrow;
    $("#param-luk")[0].innerText = parameter.luk + parameter.lukGrow;
    $("#param-ide")[0].innerText = parameter.getIde() + parameter.ideGrow;
    $("#param-knw")[0].innerText = parameter.getKnw() + parameter.knwGrow;
    $("#param-bld")[0].innerText = parameter.getBld();
    $("#param-db")[0].innerText = parameter.getDb();
    $("#param-mov")[0].innerText = parameter.getMov();
    $("#param-hp")[0].innerText = `HP ${parameter.getHp() + parameter.hpGrow}`;
    $("#param-mp")[0].innerText = `MP ${parameter.getMp() + parameter.mpGrow}`;
    $("#param-bld")[0].innerText = `BLD ${parameter.getBld()}`;
    $("#param-db")[0].innerText = `DB ${parameter.getDb()}`;
    $("#param-mov")[0].innerText = `MOV ${parameter.getMov()}`;
    var limit = 99 - (cthulhuSkill.init + cthulhuSkill.job + cthulhuSkill.interest + cthulhuSkill.grow + cthulhuSkill.other);
    $("#param-san")[0].innerText = `SAN ${parameter.san}/${limit}`;
    $("#param-san-indefinite")[0].innerText = `不定領域 ${parseInt(parameter.san * 0.8)}`;
}
function toSkillItem(skill) {
    var value = skill.init + skill.job + skill.interest + skill.grow + skill.other;
    var skillName = skill.subname ? `${skill.name}(${skill.subname})` : skill.name;
    return `<div class="item"><div class="center aligned content"><div class="header">${skillName}</div><div class="ui center aligned description">${value}</div></div></div>`;
}
function toWeaponItem(weapon) {
    return `<tr><td>${weapon.name}</td><td>${weapon.rate}</td><td>${weapon.damage}</td><td>${weapon.range}</td><td>${weapon.attacks}</td><td>${weapon.elastic}</td><td>${weapon.failure}</td></tr>`;
}
function toEquipItem(equip) {
    return `<tr><td>${equip.name}</td><td>${equip.price}</td><td>${equip.quantity}</td><td>${equip.price * equip.quantity}</td><td>${equip.description}</td></tr>`;
}
function initBackstory(backstory) {
    $("#backstory-personalDescription")[0].innerText = backstory.personalDescription;
    $("#backstory-ideologyOrBeliefs")[0].innerText = backstory.ideologyOrBeliefs;
    $("#backstory-significantPeople")[0].innerText = backstory.significantPeople;
    $("#backstory-meaningfulLocations")[0].innerText = backstory.meaningfulLocations;
    $("#backstory-treasuredPossessions")[0].innerText = backstory.treasuredPossessions;
    $("#backstory-traits")[0].innerText = backstory.traits;
    $("#backstory-injuriesAndScars")[0].innerText = backstory.injuriesAndScars;
    $("#backstory-phobiasAndManias")[0].innerText = backstory.phobiasAndManias;
    $("#backstory-spellsAndArtifacts")[0].innerText = backstory.spellsAndArtifacts;
    $("#backstory-encounters")[0].innerText = backstory.encounters;
}

window.onload = function () {
    initSigns();
    initAccount(account);

    $("#investigator-edit")[0].addEventListener("click", function (e) {
        window.location.href = "sheet?v=" + investigator.id;
    });

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

    $(".ui.accordion").accordion({ exclusive: false });
    $(".ui.blurring").dimmer("show");
    $(".ui.pointing.menu .item").tab();
};

account = getLoginAccount();
var paramV = parseInt(getParam("v"));
if (paramV) {
    getEditingInvestigator(account, parseInt(getParam("v")), function (newInvestigator) {
        investigator = newInvestigator;
        initInvestigator(investigator);
    });
}
