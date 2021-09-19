function toProfileCard(id, profile) {
    var list = `<div class="ui large inverted horizontal list meta"><div class="item"><div class="content"><div class="header">職業</div><div class="description">${profile.job}</div></div></div><div class="item"><div class="content"><div class="header">年齢</div><div class="ui center aligned description">${profile.age}</div></div></div><div class="item"><div class="content"><div class="header">性別</div><div class="ui center aligned description">${profile.gender}</div></div></div></div>`;
    var content = `<div class="content"><img id="profile-image-${id}" class="left floated tiny ui image" src="images/loading.gif" /><div class="header">${profile.name}</div><div class="meta">${toTags(profile.tag).join(",")}</div>${list}</div>`;
    var extraContent = `<div class="extra content"><div class="ui three buttons"><button id="investigator-${id}-edit" class="ui button" style="display: flex"><i class="edit outline icon"></i><div>編集</div></button><button id="investigator-${id}-view" class="ui button" style="display: flex"><i class="eye icon"></i><div>閲覧</div></button><button id="investigator-${id}-export" class="ui button" style="display: flex"><i class="share icon"></i><div>出力</div></button></div></div>`;
    return `<div id="investigator-${id}" class="card">${content}${extraContent}</div>`;
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
function expoetInvestigator(e) {
    var matches = (e.path[0].id + e.path[1].id).trim().match(/investigator-(\w+)-export/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    investigator = getEditingInvestigator(account, id);
    $("#investigator-export-chatpalette")[0].value = exportChatpalete(investigator, false);
    $(".ui.tiny.export.modal").modal({ duration: 200 }).modal("show");
}

account = getLoginAccount();

window.onload = function () {
    initSigns();
    initAccount(account);
    if(localStorage.mypage_investigators){
        $("#investigators").append(localStorage.mypage_investigators);
    }

    $(".ui.pointing.menu .item").tab();

    $("#investigator-export-commands-copy")[0].addEventListener("click", function (e) {
        writeClipboard($("#investigator-export-chatpalette")[0].value);
    });
    $("#investigator-export-commands-copy-ccfolia")[0].addEventListener("click", function (e) {
        var ccfoliaInvestigator = getCcfoliaClipboardInvestigator(investigator);
        writeClipboard(JSON.stringify(ccfoliaInvestigator));
    });

    getUserInvestigators(account, function (newInvestigators) {
        investigators = newInvestigators;
        var tagStatistics = [];
        $("#investigators").empty()
        for (var i = 0; i < investigators.length; i++) {
            var investigator = investigators[i];
            $("#investigators").append(toProfileCard(investigator.id, investigator.profile));
            $("#investigator-" + investigator.id + "-view")[0].addEventListener("click", linkView);
            $("#investigator-" + investigator.id + "-edit")[0].addEventListener("click", linkEdit);
            $("#investigator-" + investigator.id + "-export")[0].addEventListener("click", expoetInvestigator);
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
            $("#tags a.blue.label").find("strong").each(function (index, element) {
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

        setTimeout(function(){
            for (var i = 0; i < investigators.length; i++) {
                var investigator = investigators[i];
                $(`#profile-image-${investigator.id}`)[0].src = `img?v=${investigator.id}`;
            }
        }, 10);
    });
};
