function toProfileCard(id, profile) {
    var list = `<div class="ui large inverted horizontal list meta"><div class="item"><div class="content"><div class="header">職業</div><div class="description">${profile.job}</div></div></div><div class="item"><div class="content"><div class="header">年齢</div><div class="ui center aligned description">${profile.age}</div></div></div><div class="item"><div class="content"><div class="header">性別</div><div class="ui center aligned description">${profile.gender}</div></div></div></div>`;
    var content = `<div class="content"><img class="left floated tiny ui image" src="${profile.image}" /><div class="header">${profile.name}</div><div class="meta">${toTags(profile.tag).join(",")}</div>${list}</div>`;
    return `<div id="investigator-${id}-view" class="card" style="cursor : pointer;">${content}</div>`;
}
function linkView(e) {
    var path;
    for (var i = 0; i < e.path.length; i++) {
        path = e.path[i];
        if (path.id) {
            break;
        }
    }

    var matches = path.id.match(/investigator-(\w+)-view/);
    if (matches == null) return;
    var id = parseInt(matches[1]);
    window.location.href = "view?v=" + id;
}
account = getLoginAccount();

window.onload = function () {
    $("#link-sheet")[0].addEventListener("click", function (e) {
        window.location.href = "sheet";
    });

    initSigns();
    initAccount(account);
    if(localStorage.index_investigators){
        $("#investigators").append(localStorage.index_investigators);
    }

    getRecentlyCreatedInvestigators(function (investigators) {
        $("#investigators").empty()
        for (var i = 0; i < investigators.length; i++) {
            var investigator = investigators[i];
            $("#investigators").append(toProfileCard(investigator.id, investigator.profile));
            $("#investigator-" + investigator.id + "-view")[0].addEventListener("click", linkView);
        }
        localStorage.index_investigators = $("#investigators")[0].innerHTML;
    });
};