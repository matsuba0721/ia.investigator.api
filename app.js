const RES_OK = 0;
const RES_ACCOUNT_NOTFOUND = 100;
const RES_USERNAME_DEPLICATE = 101;
const RES_ERROR = -1;

var express = require("express");
var cors = require("cors");
var crypto = require("crypto");
var fs = require("fs");
const e = require("express");
var app = express();

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.get("/", async function (request, response) {
    fs.readFile("./public/index.html", "utf-8", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
    });
});
app.get("/mypage", async function (request, response) {
    fs.readFile("./public/mypage.html", "utf-8", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
    });
});
app.get("/view", async function (request, response) {
    fs.readFile("./public/view.html", "utf-8", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
    });
});
app.get("/sheet", async function (request, response) {
    fs.readFile("./public/sheet.html", "utf-8", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
    });
});
app.get("/img", async function (request, response) {
    var pool = getPool();
    try {
        var img = await getInvestigatorProfileImage(pool, request.query.v);
        if (img) {
            response.writeHead(200, { "Content-Type": img.type });
            response.end(img.data);
        } else {
            fs.readFile("public/images/wireframe.png", (err, data) => {
                response.type("png");
                response.send(data);
            });
        }
    } catch (error) {
        console.log(error);
        response.send(error);
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});
app.get("/sns", async function (request, response) {
    var pool = getPool();
    try {
        var data = await getInvestigatorSnsHtml(pool, request.query.v);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
    } catch (error) {
        console.log(error);
        response.send(error);
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});
app.get("/tools", async function (request, response) {
    fs.readFile("./public/tools.html", "utf-8", function (err, data) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
    });
});
app.post("/getAccount", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await getAccount(pool, request.body.username, request.body.password));
    } catch (error) {
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/saveAccount", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await saveAccount(pool, request.body.username, request.body.password, request.body.email));
    } catch (error) {
        var code = error.code == "23505" ? RES_USERNAME_DEPLICATE : RES_ERROR;
        response.send(toResultObject(code, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/getNewInvestigator", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await getNewInvestigator(pool, request.body.token));
    } catch (error) {
        console.log(error);
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/getInvestigatorEditable", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await getInvestigatorEditable(pool, request.body.token, request.body.id));
    } catch (error) {
        console.log(error);
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/getInvestigator", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await getInvestigator(pool, request.body.id));
    } catch (error) {
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/saveInvestigator", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await saveInvestigator(pool, request.body.token, request.body.investigator));
    } catch (error) {
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/deleteInvestigator", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await deleteInvestigator(pool, request.body.token, request.body.id));
    } catch (error) {
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/saveInvestigatorProfileImage", async function (request, response) {
    var pool = getPool();
    try {
        var image = request.body.image;
        var imgType = image.substring(5, image.indexOf(";"));
        var imgbyte = Buffer.from(image.replace("data:" + imgType + ";base64,", ""), "base64");
        response.send(await saveInvestigatorProfileImage(pool, request.body.token, request.body.id, imgType, imgbyte));
    } catch (error) {
        console.log(error);
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/getUserInvestigators", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await getUserInvestigators(pool, request.body.token));
    } catch (error) {
        console.log(error);
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/getRecentlyCreatedInvestigators", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await getRecentlyCreatedInvestigators(pool));
    } catch (error) {
        console.log(error);
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.listen(app.get("port"), function () {
    console.log("Node app is running at localhost:" + app.get("port"));
});

function getPool() {
    var pg = require("pg");
    var pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
    return pool;
}

async function sha256(str) {
    return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

function toResultObject(code, result) {
    return {
        code: code,
        result: result,
    };
}

async function GetRows(result) {
    if (result.rows) {
        return result.rows;
    } else {
        return [];
    }
}

async function getAccount(pool, username, password) {
    var queryString = `SELECT id, token FROM IaAccounts WHERE name = $1 and password = $2 LIMIT 1 OFFSET 0;`;
    console.log(queryString, [username, password]);
    var result = await pool.query(queryString, [username, password]);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ACCOUNT_NOTFOUND, { id: 0, name: username, token: "" });
    }
    return toResultObject(RES_OK, { id: rows[0].id, name: username, token: rows[0].token.trim() });
}

async function saveAccount(pool, username, password, email) {
    var token = await sha256(new Date().toUTCString());
    var queryString = `INSERT INTO IaAccounts(name,password,email,token,createtimestamp,updatetimestamp) VALUES ($1,$2,$3,$4, now(), now()) RETURNING id;`;
    console.log(queryString, [username, password, email, token]);
    var result = await pool.query(queryString, [username, password, email, token]);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ERROR, {});
    }
    return toResultObject(0, { id: rows[0].id, name: username, token: token });
}

async function getInvestigatorSnsHtml(pool, id) {
    var profile = { id: id, name: "Unknown" };
    var queryString = `SELECT RTRIM(Name) AS Name, RTRIM(Kana) AS Kana FROM IaInvestigatorProfiles WHERE InvestigatorId = $1 LIMIT 1 OFFSET 0;`;
    console.log(queryString, [id]);
    var result = await pool.query(queryString, [id]);
    var rows = await GetRows(result);
    if (rows.length > 0) {
        var row = rows[0];
        profile.name = row.name ? row.name : "Unknown";
        profile.kana = row.kana ? row.kana : "";
    }
    return `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>${profile.name}</title>
        <meta name="description" content="R'lyeh House">
        <meta name="keywords" content="R'lyeh House">
        <meta property="og:locale" content="ja_JP">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://ia-investigator.herokuapp.com/view?v=${id}">
        <meta property="og:title" content="${profile.name}">
        <meta property="og:site_name" content="R'lyeh House">
        <meta property="og:description" content="${profile.kana}">
        <meta property="og:image" content="https://ia-investigator.herokuapp.com/img?v=${id}">
        <meta property="og:image:width" content=300px>
        <meta property="og:image:height" content=300px>
        <meta property="fb:app_id" content="${profile.name}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${profile.name}">
        <meta name="twitter:description" content="${profile.kana}">
        <meta name="twitter:image" content="https://ia-investigator.herokuapp.com/img?v=${id}">
        <meta name="twitter:site" content="https://ia-investigator.herokuapp.com/view?v=${id}">
        <meta name="twitter:creator" content="R'lyeh House">
    </head>
    <body>
        <script>
            location.href = '/view?v=${id}';
        </script>
    </body>
</html>`;
}

function getInitInvestigator(id) {
    return {
        id: id,
        isHidden: false,
        isNPC: false,
        profile: {
            name: "",
            kana: "",
            tag: "",
            job: "",
            age: "",
            gender: "",
            height: "",
            weight: "",
            origin: "",
            hairColor: "",
            eyeColor: "",
            skinColor: "",
            image: "./images/wireframe.png",
        },
        parameter: {
            str: 0,
            con: 0,
            siz: 0,
            dex: 0,
            app: 0,
            int: 0,
            pow: 0,
            edu: 0,
            luk: 0,
            ide: 0,
            knw: 0,
            hp: 0,
            mp: 0,
            strGrow: 0,
            conGrow: 0,
            sizGrow: 0,
            dexGrow: 0,
            appGrow: 0,
            intGrow: 0,
            powGrow: 0,
            eduGrow: 0,
            lukGrow: 0,
            ideGrow: 0,
            knwGrow: 0,
            hpGrow: 0,
            mpGrow: 0,
            san: 0,
            jobPoints: 0,
            jobPointsCorrection: 0,
            interestPointsCorrection: 0,
        },
        skills: [
            { category: "combat", id: 0, name: "回避", subname: "", init: 30, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "combat", id: 1, name: "近接戦闘", subname: "格闘", init: 25, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "combat", id: 2, name: "近接戦闘", subname: "斧", init: 15, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "combat", id: 3, name: "近接戦闘", subname: "刀剣", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "combat", id: 4, name: "射撃", subname: "拳銃", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "combat", id: 5, name: "射撃", subname: "L/SG", init: 25, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "combat", id: 6, name: "投擲", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 7, name: "目星", subname: "", init: 25, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 8, name: "聞き耳", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 9, name: "図書館", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 10, name: "コンピューター", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 11, name: "ナビゲート", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 12, name: "経理", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 13, name: "応急手当", subname: "", init: 30, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 14, name: "鍵開け", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "survey", id: 15, name: "手さばき", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 16, name: "信用", subname: "", init: 0, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 17, name: "説得", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 18, name: "言いくるめ", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 19, name: "威圧", subname: "", init: 15, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 20, name: "魅惑", subname: "", init: 15, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 21, name: "心理学", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "personal", id: 22, name: "精神分析", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 23, name: "隠密", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 24, name: "登擧", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 25, name: "跳躍", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 26, name: "追跡", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 27, name: "変装", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 28, name: "機械修理", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 29, name: "電気修理", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "conduct", id: 30, name: "芸術/製作", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "conduct", id: 31, name: "サバイバル", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "transfer", id: 32, name: "運転", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "transfer", id: 33, name: "乗馬", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "transfer", id: 34, name: "水泳", subname: "", init: 20, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "transfer", id: 35, name: "操縦", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "transfer", id: 36, name: "重機械操作", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 37, name: "クトゥルフ神話", subname: "", init: 0, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 38, name: "オカルト", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 39, name: "伝承", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "knowledge", id: 40, name: "医学", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 41, name: "科学", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "knowledge", id: 42, name: "自然", subname: "", init: 10, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 43, name: "電子工学", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 44, name: "母国語", subname: "", init: 80, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "knowledge", id: 45, name: "言語", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: true, initEditable: false, deletable: false },
            { category: "knowledge", id: 46, name: "人類学", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 47, name: "考古学", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 48, name: "歴史", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 49, name: "鑑定", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "knowledge", id: 50, name: "法律", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "uncommon", id: 51, name: "ダイビング", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "uncommon", id: 52, name: "砲", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "uncommon", id: 53, name: "爆破", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "uncommon", id: 54, name: "読唇術", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "uncommon", id: 55, name: "ヒプノーシス", subname: "", init: 1, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
            { category: "uncommon", id: 56, name: "動物使い", subname: "", init: 5, job: 0, interest: 0, grow: 0, other: 0, nameEditable: false, subnameEditable: false, initEditable: false, deletable: false },
        ],
        weapons: [{ category: "melee", id: 0, name: "素手", rate: 25, rateSkillName: "近接戦闘(格闘)", damage: "1d3+db", range: "0", attacks: "1", elastic: "", failure: "", nameEditable: true, editable: false }],
        equips: [],
        money: { pocket: "", cash: "", assets: "" },
        backstory: { personalDescription: "", ideologyOrBeliefs: "", significantPeople: "", meaningfulLocations: "", treasuredPossessions: "", traits: "", injuriesAndScars: "", phobiasAndManias: "", spellsAndArtifacts: "", encounters: "" },
        memo: "",
    };
}

async function getNewInvestigator(pool, token) {
    if (!token) {
        return toResultObject(RES_OK, { id: 0 });
    }

    var queryString = `SELECT Id FROM IaInvestigators WHERE AccountToken = $1 AND IsEmpty = 1 LIMIT 1 OFFSET 0;`;
    console.log(queryString, [token]);
    var result = await pool.query(queryString, [token]);
    var rows = await GetRows(result);
    if (rows.length > 0) {
        return toResultObject(RES_OK, { id: rows[0].id });
    }

    queryString = `INSERT INTO IaInvestigators(AccountToken,IsEmpty,createtimestamp,updatetimestamp) VALUES ($1, 1, now(), now()) RETURNING id;`;
    console.log(queryString, [token]);
    result = await pool.query(queryString, [token]);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ERROR, {});
    }

    return toResultObject(RES_OK, { id: rows[0].id });
}

async function getInvestigatorEditable(pool, token, id) {
    if (!token || !id) {
        return toResultObject(RES_OK, { editable: false });
    }

    var queryString = `SELECT AccountToken FROM IaInvestigators WHERE id = $1 LIMIT 1 OFFSET 0;`;
    console.log(queryString, [id]);
    var result = await pool.query(queryString, [id]);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_OK, { editable: false });
    } else {
        return toResultObject(RES_OK, { editable: rows[0].accounttoken == token });
    }
}

async function getInvestigator(pool, id) {
    if (id == 0) {
        return toResultObject(RES_OK, getInitInvestigator(0));
    }
    var queryString = `SELECT IaInvestigators.Id, IaInvestigators.IsHidden, IaInvestigators.IsNPC, IaInvestigators.AccountToken AS Token, IaInvestigators.IsEmpty, json_build_object('name',RTRIM(IaInvestigatorProfiles.Name), 'kana',RTRIM(IaInvestigatorProfiles.Kana), 'tag',RTRIM(IaInvestigatorProfiles.Tag), 'job',RTRIM(IaInvestigatorProfiles.Job), 'age',RTRIM(IaInvestigatorProfiles.Age), 'gender',RTRIM(IaInvestigatorProfiles.Gender), 'height',RTRIM(IaInvestigatorProfiles.Height), 'weight',RTRIM(IaInvestigatorProfiles.Weight), 'origin',RTRIM(IaInvestigatorProfiles.Origin), 'hairColor',RTRIM(IaInvestigatorProfiles.HairColor), 'eyeColor',RTRIM(IaInvestigatorProfiles.EyeColor), 'skinColor',RTRIM(IaInvestigatorProfiles.SkinColor)) AS Profile, IaInvestigatorDetails.Parameter, IaInvestigatorDetails.Skills, IaInvestigatorDetails.Weapons, IaInvestigatorDetails.Equips, IaInvestigatorDetails.Money, IaInvestigatorDetails.Backstory, IaInvestigatorDetails.Memo FROM IaInvestigators LEFT OUTER JOIN IaInvestigatorProfiles ON (IaInvestigators.Id = IaInvestigatorProfiles.InvestigatorId) LEFT OUTER JOIN IaInvestigatorDetails ON (IaInvestigators.Id = IaInvestigatorDetails.InvestigatorId) WHERE IaInvestigators.Id = $1 LIMIT 1 OFFSET 0;`;
    console.log(queryString, [id]);
    var result = await pool.query(queryString, [id]);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ERROR, {});
    }
    var row = rows[0];
    if (row.isempty == 1) {
        return toResultObject(RES_OK, getInitInvestigator(row.id));
    }
    return toResultObject(RES_OK, {
        id: row.id,
        isHidden: row.ishidden == 0 ? false : true,
        isNPC: row.isnpc == 0 ? false : true,
        profile: row.profile,
        parameter: JSON.parse(row.parameter),
        skills: JSON.parse(row.skills),
        weapons: JSON.parse(row.weapons),
        equips: JSON.parse(row.equips),
        money: JSON.parse(row.money),
        backstory: JSON.parse(row.backstory),
        memo: row.memo,
    });
}

async function saveInvestigator(pool, token, investigator) {
    var parameter = JSON.stringify(investigator.parameter);
    var skills = JSON.stringify(investigator.skills);
    var weapons = JSON.stringify(investigator.weapons);
    var equips = JSON.stringify(investigator.equips);
    var money = JSON.stringify(investigator.money);
    var backstory = JSON.stringify(investigator.backstory);
    var memo = investigator.memo;

    var queryString;
    queryString = `INSERT INTO IaInvestigatorProfiles(InvestigatorId,AccountToken,Name,Kana,Tag,Job,Age,Gender,Height,Weight,Origin,HairColor,EyeColor,SkinColor,CreateTimestamp, UpdateTimestamp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,now(),now()) ON CONFLICT (InvestigatorId) DO UPDATE SET Name = $3,Kana = $4,Tag = $5,Job = $6,Age= $7,Gender = $8,Height = $9,Weight = $10,Origin = $11,HairColor = $12,EyeColor = $13,SkinColor = $14,UpdateTimestamp = now() WHERE IaInvestigatorProfiles.InvestigatorId = $1 AND IaInvestigatorProfiles.AccountToken = $2;`;
    console.log(queryString, [investigator.id, token, investigator.profile.name, investigator.profile.kana, investigator.profile.tag, investigator.profile.job, investigator.profile.age, investigator.profile.gender, investigator.profile.height, investigator.profile.weight, investigator.profile.origin, investigator.profile.hairColor, investigator.profile.eyeColor, investigator.profile.skinColor]);
    await pool.query(queryString, [investigator.id, token, investigator.profile.name, investigator.profile.kana, investigator.profile.tag, investigator.profile.job, investigator.profile.age, investigator.profile.gender, investigator.profile.height, investigator.profile.weight, investigator.profile.origin, investigator.profile.hairColor, investigator.profile.eyeColor, investigator.profile.skinColor]);

    queryString = `INSERT INTO IaInvestigatorDetails(InvestigatorId,AccountToken,Parameter,Skills,Weapons,Equips,Money,Backstory,Memo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (InvestigatorId) DO UPDATE SET Parameter = $3, Skills = $4, Weapons = $5, Equips = $6, Money = $7, Backstory = $8, Memo = $9 WHERE IaInvestigatorDetails.InvestigatorId = $1 AND IaInvestigatorDetails.AccountToken = $2;`;
    console.log(queryString, [investigator.id, token]);
    await pool.query(queryString, [investigator.id, token, parameter, skills, weapons, equips, money, backstory, memo]);

    queryString = `UPDATE IaInvestigators SET IsEmpty = 0, IsHidden = $3, IsNPC = $4 WHERE IaInvestigators.Id = $1 AND IaInvestigators.AccountToken = $2`;
    console.log(queryString, [investigator.id, token, investigator.isHidden ? 1 : 0, investigator.isNPC ? 1 : 0]);
    await pool.query(queryString, [investigator.id, token, investigator.isHidden ? 1 : 0, investigator.isNPC ? 1 : 0]);

    return toResultObject(RES_OK, { id: investigator.id });
}
async function deleteInvestigator(pool, token, id) {
    var queryString;
    queryString = `DELETE FROM IaInvestigatorProfiles WHERE InvestigatorId = $1 AND AccountToken = $2;`;
    console.log(queryString, [id, token]);
    await pool.query(queryString, [id, token]);

    queryString = `DELETE FROM IaInvestigatorProfileImages WHERE InvestigatorId = $1 AND AccountToken = $2;`;
    console.log(queryString, [id, token]);
    await pool.query(queryString, [id, token]);

    queryString = `DELETE FROM IaInvestigatorDetails WHERE InvestigatorId = $1 AND AccountToken = $2;`;
    console.log(queryString, [id, token]);
    await pool.query(queryString, [id, token]);

    queryString = `DELETE FROM IaInvestigators WHERE Id = $1 AND AccountToken = $2;`;
    console.log(queryString, [id, token]);
    await pool.query(queryString, [id, token]);

    return toResultObject(RES_OK, { id: id });
}

async function getInvestigatorProfileImage(pool, id) {
    var queryString = `SELECT type, Data FROM IaInvestigatorProfileImages WHERE InvestigatorId = $1 LIMIT 1 OFFSET 0;`;
    console.log(queryString, [id]);
    var result = await pool.query(queryString, [id]);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return null;
    }
    var row = rows[0];
    return { type: row.type, data: row.data };
}

async function saveInvestigatorProfileImage(pool, token, id, imgType, image) {
    var queryString = `INSERT INTO IaInvestigatorProfileImages(InvestigatorId,AccountToken,type,Data) VALUES ($1,$2,$3,$4) ON CONFLICT (InvestigatorId) DO UPDATE SET type =$3, Data = $4 WHERE IaInvestigatorProfileImages.InvestigatorId = $1 AND IaInvestigatorProfileImages.AccountToken = $2;`;
    console.log(queryString, [id, token, imgType]);
    await pool.query(queryString, [id, token, imgType, image]);

    return toResultObject(RES_OK, { id: id });
}

async function getUserInvestigators(pool, token) {
    var queryString = `SELECT IaInvestigators.Id, IaInvestigators.IsHidden, IaInvestigators.IsNPC, json_build_object('name',RTRIM(IaInvestigatorProfiles.Name), 'kana',RTRIM(IaInvestigatorProfiles.Kana), 'tag',RTRIM(IaInvestigatorProfiles.Tag), 'job',RTRIM(IaInvestigatorProfiles.Job), 'age',RTRIM(IaInvestigatorProfiles.Age), 'gender',RTRIM(IaInvestigatorProfiles.Gender)) AS Profile FROM IaInvestigators LEFT OUTER JOIN IaInvestigatorProfiles ON (IaInvestigators.Id = IaInvestigatorProfiles.InvestigatorId) WHERE IaInvestigators.AccountToken = $1 AND IaInvestigators.IsEmpty=0 ORDER BY IaInvestigatorProfiles.UpdateTimestamp DESC LIMIT 100 OFFSET 0;`;
    console.log(queryString, [token]);
    var result = await pool.query(queryString, [token]);
    var rows = await GetRows(result);

    var investigators = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        investigators.push({
            id: row.id,
            isHidden: row.ishidden == 0 ? false : true,
            isNPC: row.isnpc == 0 ? false : true,
            profile: row.profile,
        });
    }

    return toResultObject(RES_OK, investigators);
}

async function getRecentlyCreatedInvestigators(pool) {
    var queryString = `SELECT IaInvestigators.Id, IaInvestigators.IsHidden, IaInvestigators.IsNPC, json_build_object('name',RTRIM(IaInvestigatorProfiles.Name), 'kana',RTRIM(IaInvestigatorProfiles.Kana), 'tag',RTRIM(IaInvestigatorProfiles.Tag), 'job',RTRIM(IaInvestigatorProfiles.Job), 'age',RTRIM(IaInvestigatorProfiles.Age), 'gender',RTRIM(IaInvestigatorProfiles.Gender), 'image', IaInvestigatorProfileImages.Data) AS Profile FROM IaInvestigators LEFT OUTER JOIN IaInvestigatorProfiles ON (IaInvestigators.Id = IaInvestigatorProfiles.InvestigatorId) LEFT OUTER JOIN IaInvestigatorProfileImages ON (IaInvestigators.Id = IaInvestigatorProfileImages.InvestigatorId) WHERE IaInvestigators.IsEmpty = 0 AND IaInvestigators.IsHidden = 0 AND IaInvestigators.IsNPC = 0 ORDER BY IaInvestigatorProfiles.CreateTimestamp DESC LIMIT 10 OFFSET 0;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);

    var investigators = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        investigators.push({
            id: row.id,
            isNPC: row.isnpc == 0 ? false : true,
            isHidden: row.isHidden == 0 ? false : true,
            profile: row.profile,
        });
    }

    return toResultObject(RES_OK, investigators);
}
