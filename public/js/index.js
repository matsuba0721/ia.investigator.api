function accountChanged(account) {
    if (started && account.id > 0) {
        window.location.href = "sheet";
    }
}
function toProfileCard(id, profile) {
    var list = `<div class="ui large inverted horizontal list meta"><div class="item"><div class="content"><div class="header">職業</div><div class="description">${profile.job}</div></div></div><div class="item"><div class="content"><div class="header">年齢</div><div class="ui center aligned description">${profile.age}</div></div></div><div class="item"><div class="content"><div class="header">性別</div><div class="ui center aligned description">${profile.gender}</div></div></div></div>`;
    var content = `<div class="content"><img id="profile-image-${id}" class="left floated tiny ui image" src="images/loading.gif" /><div class="header">${profile.name}</div><div class="meta">${toTags(profile.tag).join(",")}</div>${list}</div>`;
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

    var id  = path.id.replace("investigator-", "").replace("-view", "");
    window.location.href = "view?v=" + id;
}
started = false;
account = getLoginAccount();

window.onload = function () {
    $("#start")[0].addEventListener("click", function (e) {
        if (account.id > 0) {
            window.location.href = "sheet";
        } else {
            started = true;
            $(".ui.account-sign-up").hide();
            $(".ui.account-sign-in").show();
            $(".ui.account.modal").modal("show", { duration: 200 });
        }
    });

    initSigns();
    initAccount(account);
    if (localStorage.index_investigators) {
        $("#investigators").append(localStorage.index_investigators);
    }

    getRecentlyCreatedInvestigators(function (investigators) {
        $("#investigators").empty();
        for (var i = 0; i < investigators.length; i++) {
            var investigator = investigators[i];
            $("#investigators").append(toProfileCard(investigator.id, investigator.profile, `img?v=${investigator.id}`));
            $("#investigator-" + investigator.id + "-view")[0].addEventListener("click", linkView);
        }
        localStorage.index_investigators = $("#investigators")[0].innerHTML;

        setTimeout(function () {
            for (var i = 0; i < investigators.length; i++) {
                var investigator = investigators[i];
                $(`#profile-image-${investigator.id}`)[0].src = `img?v=${investigator.id}`;
            }
        }, 10);
    });
};
