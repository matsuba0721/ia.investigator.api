function accountChanged(account) {
    getUserInvestigators(account, initInvestigator);
}
function initInvestigator(newInvestigators) {
    investigators = newInvestigators;
    var tagStatistics = [];
    $("#investigators").empty();

    for (var i = 0; i < investigators.length; i++) {
        var investigator = investigators[i];
        $("#investigators").append(toProfileCard(investigator.id, investigator.isHidden, investigator.isNPC, investigator.profile));
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

    $("#tags").empty();
    tagStatistics = tagStatistics.sort(function (x, y) {
        return y.value - x.value;
    });
    for (var i = 0; i < tagStatistics.length; i++) {
        $("#tags").append(`<a class="ui label"><strong>${tagStatistics[i].name}</strong> ${tagStatistics[i].value}</a>`);
    }
    localStorage.mypage_tags = $("#tags")[0].innerHTML;

    $("#tags a.label").on("click", function () {
        $(this).toggleClass("blue");
        filterProfileCard();
    });

    filterProfileCard();
    lazyload();
}
function filterProfileCard() {
    var cards = [];
    for (var i = 0; i < investigators.length; i++) {
        var investigator = investigators[i];
        cards.push({
            id: "#investigator-" + investigator.id,
            tag: investigator.profile.tag,
            isHidden: investigator.isHidden,
            isNPC: investigator.isNPC,
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

    var tab = $("#tab-filter a.active")[0].text;
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (tab == "PC" && (card.isNPC || card.isHidden)) {
            card.isDisplay = false;
        } else if (tab == "NPC" && (!card.isNPC || card.isHidden)) {
            card.isDisplay = false;
        } else if (tab == "非公開" && !card.isHidden) {
            card.isDisplay = false;
        }
    }
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.isDisplay) $(card.id).show();
        else $(card.id).hide();
    }
}
function toProfileCard(id, isHidden, isNPC, profile) {
    var list = `<div class="ui large inverted horizontal list meta"><div class="item"><div class="content"><div class="header">職業</div><div class="description">${profile.job}</div></div></div><div class="item"><div class="content"><div class="header">年齢</div><div class="ui center aligned description">${profile.age}</div></div></div><div class="item"><div class="content"><div class="header">性別</div><div class="ui center aligned description">${profile.gender}</div></div></div></div>`;
    var hiddenlabel = isHidden ? `<div class="ui basic red label" style="width: 50px;padding: 0.5em;">非公開</div>` : "";
    var npclabel = isNPC ? `<div class="ui basic yellow label" style="width: 50px;padding: 0.5em;">NPC</div>` : "";
    var w = isHidden || isNPC ? 50 : 0;
    var content = `<div class="content" style="padding: 5px;"><div class="ui right floated labels" style="width: ${w}px;padding: 0;">${hiddenlabel}${npclabel}</div><img class="lazyload left floated tiny ui image" src="images/loading.gif" data-src="/img?v=${id}" /><div class="header">${profile.name}</div><div class="meta">${toTags(profile.tag).join(",")}</div>${list}</div>`;
    var extraContent = `<div class="ui right aligned　extra content" style="padding: 5px;"><div class="ui buttons"><a href="/sheet?v=${id}" class="ui icon button" style="padding: 10px 5px;"><i class="edit outline icon"></i>編集</a><a href="/view?v=${id}" class="ui icon button" style="padding: 10px 5px;"><i class="eye icon"></i>閲覧</a><button id="investigator-${id}-share" class="ui icon button" style="padding: 10px 5px;"><i class="share alternate icon"></i>共有</button><button id="investigator-${id}-export" class="ui icon button" style="padding: 10px 5px;"><i class="share icon"></i>出力</button><button id="investigator-${id}-delete" class="ui icon button" style="padding: 10px 5px;"><i class="trash alternate icon"></i>削除</button></div></div>`;
    return `<div id="investigator-${id}" class="ui left aligned column" style="margin: 0!important;"><div class="ui fluid inverted card" style="min-width: 285px;">${content}${extraContent}</div></div>`;
}
function exportInvestigator(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    for (var i = 0; i < path.length; i++) {
        var matches = path[i].id.match(/investigator-(\w+)-export/);
        if (matches) {
            var id = parseInt(matches[1]);
            getEditingInvestigator(account, id, function (newInvestigator) {
                investigator = newInvestigator;
                $(".ui.tiny.export.modal").modal({ duration: 200 }).modal("show");
                $("#investigator-export-chatpalette")[0].value = exportChatpalete(investigator, false);
            });
            break;
        }
    }
}
function getShareUrl(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    for (var i = 0; i < path.length; i++) {
        var matches = path[i].id.match(/investigator-(\w+)-share/);
        if (matches) {
            var id = parseInt(matches[1]);
            var uri = new URL(window.location.href);
            writeClipboard(uri.origin + "/sns?v=" + id);
            break;
        }
    }
}
function deletetInvestigator(e) {
    var path = e.path || (e.composedPath && e.composedPath());
    for (var i = 0; i < path.length; i++) {
        var matches = path[i].id.match(/investigator-(\w+)-delete/);
        if (matches) {
            var id = parseInt(matches[1]);
            deleteTargetInvestigatorId = id;
            $(".ui.mini.delete.modal").modal({ duration: 200 }).modal("show");
            break;
        }
    }
}

account = getLoginAccount();

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.mypage_tags) {
        $("#tags").append(localStorage.mypage_tags);
    }
    if (localStorage.mypage_investigators) {
        $("#investigators").append(localStorage.mypage_investigators);
    }
});

window.onload = function () {
    initSigns();
    initAccount(account);
    initModal();

    $("#account-recommendation-close").on("click", function () {
        $("#account-recommendation").hide();
    });

    $("#account-recommendation-link").on("click", function () {
        $(".ui.account-sign-up").hide();
        $(".ui.account-sign-in").show();
        $(".ui.account.modal").modal({ duration: 200 }).modal("show");
    });
    $("#tab-filter a").on("click", function () {
        $("#tab-filter a").removeClass("active");
        $(this).addClass("active");
        filterProfileCard();
    });

    $("#investigator-export-commands-copy")[0].addEventListener("click", function (e) {
        writeClipboard($("#investigator-export-chatpalette")[0].value);
    });
    $("#investigator-export-commands-copy-ccfolia")[0].addEventListener("click", function (e) {
        var ccfoliaInvestigator = getCcfoliaClipboardInvestigator(investigator);
        writeClipboard(JSON.stringify(ccfoliaInvestigator));
    });

    $("#investigator-delete-ok")[0].addEventListener("click", function (e) {
        deleteInvestigator(account, deleteTargetInvestigatorId, function (deletedId) {
            $("#investigator-" + deletedId).remove();
            $(".ui.mini.delete.modal").modal({ duration: 200 }).modal("hide");
        });
    });
    $("#investigator-delete-cancel")[0].addEventListener("click", function (e) {
        $(".ui.mini.delete.modal").modal({ duration: 200 }).modal("hide");
    });

    $(".ui.dropdown").dropdown();
    $(".ui.pointing.menu .item").tab();
    document.title = "マイページ | R'lyeh House";
};
