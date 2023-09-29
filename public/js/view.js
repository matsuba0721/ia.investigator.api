function accountChanged(account) {
    console.log("accountChanged");
    getInvestigatorEditable(account, parseInt(getParam("v")), function (editable) {
    console.log("getInvestigatorEditable");
        if (editable) {
            $("#investigator-edit").prop("disabled", false);
            $(".secret-data").each(function (index, element) {
                element.style.pointerEvents = 'all'
            });
        } else {
            $("#investigator-edit").prop("disabled", true);
            $(".secret-data").each(function (index, element) {
                element.style.pointerEvents = 'none'
            });
        }
    });
}
function initInvestigator(investigator) {
    if(investigator.profile.name){
        document.title = investigator.profile.name + " | R'lyeh House";
    }else{
        document.title = "新しい探索者 | R'lyeh House";
    }

    sha256(investigator.id.toString()).then((hashedKey) => {
        if(hashedKey == getParam("key") || !investigator.isHidden){
            $(".secret-data").each(function (index, element) {
                element.style.pointerEvents = 'all'
            });
        }
    });

    var cthulhuSkill = firstOrDefault(function (e) {
        return e.name == "クトゥルフ神話";
    }, investigator.skills);

    initProfile(investigator.profile);
    initParameter(investigator.parameter, cthulhuSkill, investigator.profile.age);

    $("#profile-image")[0].src = investigator.getProfileImagePath();

    var skills = [];
    var usageJobPoints = 0;
    var usageInterestPoints = 0;
    var jobPoints = investigator.parameter.jobPoints + investigator.parameter.jobPointsCorrection;
    var interestPoints = investigator.parameter.getInterestPoint() + investigator.parameter.interestPointsCorrection;
    for (var i = 0; i < investigator.skills.length; i++) {
        var skill = investigator.skills[i];
        if (skill.job + skill.interest + skill.grow + skill.other == 0) continue;
        usageJobPoints += skill.job;
        usageInterestPoints += skill.interest;
        var value = skill.init + skill.job + skill.interest + skill.grow + skill.other;
        var key = value * (skill.job ? 100 : 1);
        skills.push({
            fullname: skill.subname ? `${skill.name}(${skill.subname})` : skill.name,
            value: value,
            job: skill.job,
            interest: skill.interest,
            grow: skill.grow,
            key: key,
        });
    }
    skills = skills.sort(function (x, y) {
        return y.key- x.key;
    });
    $("#job-points-usage")[0].innerText = `職業 ${usageJobPoints}/${jobPoints}`;
    $("#interest-points-usage")[0].innerText = `興味 ${usageInterestPoints}/${interestPoints}`;
    for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
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
    marked.use({
        breaks: true,
        gfm: true,
    });
    $("#memo-open")[0].innerHTML = marked.parse(investigator.memo.open);
    $("#memo-secret")[0].innerHTML = marked.parse(investigator.memo.secret);
    $("#memo-other")[0].innerHTML = marked.parse(investigator.memo.other);
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
function initParameter(parameter, cthulhuSkill, age) {
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
    $("#param-hp")[0].innerText = `HP ${parameter.getHp() + parameter.hpGrow}`;
    $("#param-mp")[0].innerText = `MP ${parameter.getMp() + parameter.mpGrow}`;
    $("#param-bld")[0].innerText = `BLD ${parameter.getBld()}`;
    $("#param-db")[0].innerText = `DB ${parameter.getDb()}`;
    $("#param-mov")[0].innerText = `MOV ${parameter.getMov(age)}`;
    var limit = 99 - (cthulhuSkill.init + cthulhuSkill.job + cthulhuSkill.interest + cthulhuSkill.grow + cthulhuSkill.other);
    $("#param-san")[0].innerText = `SAN ${parameter.san}/${limit}`;
    $("#param-san-indefinite")[0].innerText = `不定領域 ${parseInt(parameter.san * 0.8)}`;
}
function toSkillItem(skill) {
    var job = skill.job ? `<div class="ui basic blue pinned label">職</div>` : "";
    var interest = skill.interest ? `<div class="ui basic yellow pinned label">興</div>` : "";
    var grow = skill.grow ? `<div class="ui basic green pinned label">成</div>` : "";
    var labels = `<div class="ui labels" style="text-align: left;">${job}${interest}${grow}</div>`;
    return `<tr><td>${skill.fullname}</td><td>${skill.value}</td><td>${Math.floor(skill.value / 2)}</td><td>${Math.floor(skill.value / 5)}</td><td>${labels}</td></tr>`;
}
function toWeaponItem(weapon) {
    return `<tr><td>${weapon.name}</td><td>${weapon.rate}</td><td>${weapon.damage}</td><td>${weapon.range}</td><td>${weapon.attacks}</td><td>${weapon.elastic}</td><td>${weapon.failure}</td></tr>`;
}
function toEquipItem(equip) {
    return `<tr><td>${equip.name}</td><td>${equip.price}</td><td>${equip.quantity}</td><td>${equip.price * equip.quantity}</td><td>${equip.description}</td></tr>`;
}
function initBackstory(backstory) {
    if(backstory.personalDescriptionkeyed) $("#backstory-key-personalDescription").show();
    $("#backstory-personalDescription")[0].innerText = backstory.personalDescription;
    if(backstory.ideologyOrBeliefskeyed) $("#backstory-key-ideologyOrBeliefs").show();
    $("#backstory-ideologyOrBeliefs")[0].innerText = backstory.ideologyOrBeliefs;
    if(backstory.significantPeoplekeyed) $("#backstory-key-significantPeople").show();
    $("#backstory-significantPeople")[0].innerText = backstory.significantPeople;
    if(backstory.meaningfulLocationskeyed) $("#backstory-key-meaningfulLocations").show();
    $("#backstory-meaningfulLocations")[0].innerText = backstory.meaningfulLocations;
    if(backstory.treasuredPossessionskeyed) $("#backstory-key-treasuredPossessions").show();
    $("#backstory-treasuredPossessions")[0].innerText = backstory.treasuredPossessions;
    if(backstory.traitskeyed) $("#backstory-key-traits").show();
    $("#backstory-traits")[0].innerText = backstory.traits;
    $("#backstory-injuriesAndScars")[0].innerText = backstory.injuriesAndScars;
    $("#backstory-phobiasAndManias")[0].innerText = backstory.phobiasAndManias;
    $("#backstory-spellsAndArtifacts")[0].innerText = backstory.spellsAndArtifacts;
    $("#backstory-encounters")[0].innerText = backstory.encounters;
}

window.onload = function () {
    console.log("onload");

    initSigns();
    initAccount(account);
    initModal();

    $("#investigator-share")[0].addEventListener("click", function (e) {
        var uri = new URL(window.location.href);
        writeClipboard(uri.origin + "/sns?v=" + getParam("v"));
    });

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

    $("#investigator-export-local-json")[0].addEventListener("click", function (e) {
        download(`${investigator.id}-${investigator.profile.name}`,investigator)
    });

    $(".ui.dropdown").dropdown();
    $(".ui.accordion").accordion({ exclusive: false });
    $(".ui.blurring").dimmer("show");
    $(".ui.pointing.menu .item").tab();
};

account = getLoginAccount();
var paramV = parseInt(getParam("v"));
if (paramV) {
    getEditingInvestigator(account, parseInt(getParam("v")), function (newInvestigator) {
        console.log("getEditingInvestigator");
        investigator = newInvestigator;
        initInvestigator(investigator);
    });
}
