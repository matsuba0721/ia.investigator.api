function accountChanged(account) {
    getUserInvestigators(account, initInvestigator);
}
function initInvestigator(newInvestigators) {
    investigators = newInvestigators;
    var tagStatistics = [];
    $("#investigators").empty();
    $("#tags").empty();
    for (var i = 0; i < investigators.length; i++) {
        var investigator = investigators[i];
        $("#investigators").append(toProfileCard(investigator.id, investigator.profile));
        $("#investigator-" + investigator.id + "-view")[0].addEventListener("click", linkView);
        $("#investigator-" + investigator.id + "-edit")[0].addEventListener("click", linkEdit);
        $("#investigator-" + investigator.id + "-export")[0].addEventListener("click", exportInvestigator);
        $("#investigator-" + investigator.id + "-share")[0].addEventListener("click", getShareUrl);
        $("#investigator-" + investigator.id + "-delete")[0].addEventListener("click", deletetInvestigator);
    }
    localStorage.mypage_investigators = $("#investigators")[0].innerHTML;

    for (var i = 0; i < investigators.length; i++) {
        var investigator = investigators[i];
        var tagNames = toTags(investigator.profile.tag);
        for (var j = 0; j < tagNames.length; j++) {
            var tagName = tagNames[j];
            if (!tagName) continue;
            var tag = tagStatistics.find((v) => v.name == tagName);
            if (tag) tag.value += 1;
            else tagStatistics.push({ name: tagName, value: 1 });
        }
    }

    for (var i = 0; i < tagStatistics.length; i++) {
        $("#tags").append(`<a class="ui label"><strong>${tagStatistics[i].name}</strong> ${tagStatistics[i].value}</a>`);
    }

    $("#tags a.label").on("click", function () {
        $(this).toggleClass("blue");
        var cards = [];
        for (var i = 0; i < investigators.length; i++) {
            var investigator = investigators[i];
            cards.push({
                id: "#investigator-" + investigator.id,
                tag: investigator.profile.tag,
                isDisplay: true,
            });
        }
        var count = $("#tags a.blue.label").find("strong").length;
        $("#tags a.blue.label")
            .find("strong")
            .each(function (index, element) {
                var tag = element.innerText;
                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    if (card.tag.indexOf(tag) == -1) {
                        card.isDisplay = false;
                    }
                }
            });
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (card.isDisplay) $(card.id).show();
            else $(card.id).hide();
        }
    });

    setTimeout(function () {
        for (var i = 0; i < investigators.length; i++) {
            var investigator = investigators[i];
            $(`#profile-image-${investigator.id}`)[0].src = `img?v=${investigator.id}`;
        }
    }, 10);
}
function toProfileCard(id, profile) {
    var list = `<div class="ui large inverted horizontal list meta"><div class="item"><div class="content"><div class="header">職業</div><div class="description">${profile.job}</div></div></div><div class="item"><div class="content"><div class="header">年齢</div><div class="ui center aligned description">${profile.age}</div></div></div><div class="item"><div class="content"><div class="header">性別</div><div class="ui center aligned description">${profile.gender}</div></div></div></div>`;
    var content = `<div class="content" style="padding: 5px;"><img id="profile-image-${id}" class="left floated tiny ui image" src="images/loading.gif" /><div class="header">${profile.name}</div><div class="meta">${toTags(profile.tag).join(",")}</div>${list}</div>`;
    var extraContent = `
    <div class="ui right aligned　extra content" style="padding: 5px;">
    <div class="ui buttons">
    <button id="investigator-${id}-edit" class="ui icon button" style="padding: 10px 5px;"><i class="edit outline icon"></i>編集</button>
    <button id="investigator-${id}-view" class="ui icon button" style="padding: 10px 5px;"><i class="eye icon"></i>閲覧</button>
    <button id="investigator-${id}-share" class="ui icon button" style="padding: 10px 5px;"><i class="share alternate icon"></i>共有</button>
    <button id="investigator-${id}-export" class="ui icon button" style="padding: 10px 5px;"><i class="share icon"></i>出力</button>
    <button id="investigator-${id}-delete" class="ui icon button" style="padding: 10px 5px;"><i class="trash alternate icon"></i>削除</button>
    </div>
    </div>`;
    return `<div id="investigator-${id}" class="ui left aligned column" style="margin-left: 0!important;"><div class="ui fluid inverted card" style="min-width: 285px;">${content}${extraContent}</div></div>`;
}
function linkEdit(e) {
    console.log(e);
    var matches = (e.path[0].id + e.path[1].id).trim().match(/investigator-(\w+)-edit/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    window.location.href = "sheet?v=" + id;
}
function linkView(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/investigator-(\w+)-view/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    window.location.href = "view?v=" + id;
}
function exportInvestigator(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/investigator-(\w+)-export/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    getEditingInvestigator(account, id,  function (newInvestigator) {
        investigator = newInvestigator;
        $(".ui.tiny.export.modal").modal({ duration: 200 }).modal("show");
        $("#investigator-export-chatpalette")[0].value = exportChatpalete(investigator, false);
    });
}
function getShareUrl(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/investigator-(\w+)-share/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    var uri = new URL(window.location.href);
    writeClipboard(uri.origin + "/sns?v=" + id);
}
function deletetInvestigator(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/investigator-(\w+)-delete/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    deleteTargetInvestigatorId=id
    $(".ui.mini.delete.modal").modal({ duration: 200 }).modal("show");
    
}

account = getLoginAccount();

window.onload = function () {
    initSigns();
    initAccount(account);
    if (localStorage.mypage_investigators) {
        $("#investigators").append(localStorage.mypage_investigators);
    }

    $("#account-recommendation-close").on("click", function () {
        $("#account-recommendation").hide();
    });

    $("#account-recommendation-link").on("click", function () {
        $(".ui.account-sign-up").hide();
        $(".ui.account-sign-in").show();
        $(".ui.account.modal").modal({ duration: 200 }).modal("show");
    });

    $("#link-sheet")[0].addEventListener("click", function (e) {
        window.location.href = "sheet";
    });

    $("#investigator-export-commands-copy")[0].addEventListener("click", function (e) {
        writeClipboard($("#investigator-export-chatpalette")[0].value);
    });
    $("#investigator-export-commands-copy-ccfolia")[0].addEventListener("click", function (e) {
        var ccfoliaInvestigator = getCcfoliaClipboardInvestigator(investigator);
        writeClipboard(JSON.stringify(ccfoliaInvestigator));
    });

    
    $("#investigator-delete-ok")[0].addEventListener("click", function (e) {
        deleteInvestigator(account,deleteTargetInvestigatorId,function(deletedId){
            console.log("#investigator-" + deletedId)
            $("#investigator-" + deletedId).remove();
            $(".ui.mini.delete.modal").modal({ duration: 200 }).modal("hide");
        });
    });
    $("#investigator-delete-cancel")[0].addEventListener("click", function (e) {
        $(".ui.mini.delete.modal").modal({ duration: 200 }).modal("hide");
    });

    $(".ui.pointing.menu .item").tab();

    getUserInvestigators(account, initInvestigator);
};
