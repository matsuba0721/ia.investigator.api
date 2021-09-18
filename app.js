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
        response.send(await saveAccount(pool, request.body.username, request.body.password));
    } catch (error) {
        var code = error.code == "23505" ? RES_USERNAME_DEPLICATE : RES_ERROR;
        response.send(toResultObject(code, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/createInvestigator", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await createInvestigator(pool, request.body.token));
    } catch (error) {
        response.send(toResultObject(RES_ERROR, error));
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/getInvestigator", async function (request, response) {
    console.log(request.body);
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
app.get("/getInvestigatorProfileImage", async function (request, response) {
    var pool = getPool();
    try {
        var img = await getInvestigatorProfileImage(pool, request.query.v);
        response.send(`<html><head><title>IA.Investigator</title></head><body><img src="${img}"></body></html>`);
    } catch (error) {
        response.send(error);
    } finally {
        console.log("Disconnect");
        pool.end();
    }
});

app.post("/saveInvestigatorProfileImage", async function (request, response) {
    var pool = getPool();
    try {
        response.send(await saveInvestigatorProfileImage(pool, request.body.token, request.body.id, request.body.image));
    } catch (error) {
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
    pool.queryError = function (error) {
        response.send(toResultObject(100, error));
    };
    pool.queryEnd = function () {
        console.log("切断");
        this.end();
    };
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
    var queryString = `SELECT id, token FROM IaAccounts WHERE name = '${username}' and password = '${password}' LIMIT 1 OFFSET 0;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ACCOUNT_NOTFOUND, { id: 0, name: username, token: "" });
    }
    return toResultObject(RES_OK, { id: rows[0].id, name: username, token: rows[0].token.trim() });
}

async function saveAccount(pool, username, password) {
    var token = await sha256(new Date().toUTCString());
    var queryString = `INSERT INTO IaAccounts(name,password,token,createtimestamp,updatetimestamp) VALUES ('${username}', '${password}', '${token}', now(), now()) RETURNING id;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ERROR, {});
    }
    return toResultObject(0, { id: rows[0].id, name: username, token: token });
}

function getInitInvestigator(id) {
    return {
        id: id,
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

async function createInvestigator(pool, token) {
    var queryString = `INSERT INTO IaInvestigators(AccountToken,IsEmpty,createtimestamp,updatetimestamp) VALUES ('${token}', 1, now(), now()) RETURNING id;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return toResultObject(RES_ERROR, {});
    }

    return toResultObject(RES_OK, getInitInvestigator(rows[0].id));
}

async function getInvestigator(pool, id) {
    var queryString = `SELECT IaInvestigators.Id, IaInvestigators.AccountToken AS Token, IaInvestigators.IsEmpty, json_build_object('name',RTRIM(IaInvestigatorProfiles.Name), 'kana',RTRIM(IaInvestigatorProfiles.Kana), 'tag',RTRIM(IaInvestigatorProfiles.Tag), 'job',RTRIM(IaInvestigatorProfiles.Job), 'age',RTRIM(IaInvestigatorProfiles.Age), 'gender',RTRIM(IaInvestigatorProfiles.Gender), 'height',RTRIM(IaInvestigatorProfiles.Height), 'weight',RTRIM(IaInvestigatorProfiles.Weight), 'origin',RTRIM(IaInvestigatorProfiles.Origin), 'hairColor',RTRIM(IaInvestigatorProfiles.HairColor), 'eyeColor',RTRIM(IaInvestigatorProfiles.EyeColor), 'skinColor',RTRIM(IaInvestigatorProfiles.SkinColor), 'image', IaInvestigatorProfileImages.Data) AS Profile, IaInvestigatorDetails.Parameter, IaInvestigatorDetails.Skills, IaInvestigatorDetails.Weapons, IaInvestigatorDetails.Equips, IaInvestigatorDetails.Money, IaInvestigatorDetails.Backstory, IaInvestigatorDetails.Memo FROM IaInvestigators LEFT OUTER JOIN IaInvestigatorProfiles ON (IaInvestigators.Id = IaInvestigatorProfiles.InvestigatorId) LEFT OUTER JOIN IaInvestigatorProfileImages ON (IaInvestigators.Id = IaInvestigatorProfileImages.InvestigatorId) LEFT OUTER JOIN IaInvestigatorDetails ON (IaInvestigators.Id = IaInvestigatorDetails.InvestigatorId) WHERE IaInvestigators.Id = ${id} LIMIT 1 OFFSET 0;`;
    console.log(queryString);
    var result = await pool.query(queryString);
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
    console.log(token);

    var parameter = JSON.stringify(investigator.parameter);
    var skills = JSON.stringify(investigator.skills);
    var weapons = JSON.stringify(investigator.weapons);
    var equips = JSON.stringify(investigator.equips);
    var money = JSON.stringify(investigator.money);
    var backstory = JSON.stringify(investigator.backstory);
    var memo = investigator.memo;

    var queryString;
    queryString = `INSERT INTO IaInvestigatorProfiles(InvestigatorId,AccountToken,Name,Kana,Tag,Job,Age,Gender,Height,Weight,Origin,HairColor,EyeColor,SkinColor,CreateTimestamp, UpdateTimestamp) VALUES (${investigator.id},'${token}','${investigator.profile.name}','${investigator.profile.kana}','${investigator.profile.tag}','${investigator.profile.job}','${investigator.profile.age}','${investigator.profile.gender}','${investigator.profile.height}','${investigator.profile.weight}','${investigator.profile.origin}','${investigator.profile.hairColor}','${investigator.profile.eyeColor}','${investigator.profile.skinColor}}',now(),now()) ON CONFLICT (InvestigatorId) DO UPDATE SET Name = '${investigator.profile.name}',Kana = '${investigator.profile.kana}',Tag = '${investigator.profile.tag}',Job = '${investigator.profile.job}',Age= '${investigator.profile.age}',Gender = '${investigator.profile.gender}',Height = '${investigator.profile.height}',Weight = '${investigator.profile.weight}',Origin = '${investigator.profile.origin}',HairColor = '${investigator.profile.hairColor}',EyeColor = '${investigator.profile.eyeColor}',SkinColor = '${investigator.profile.skinColor}',UpdateTimestamp = now() WHERE IaInvestigatorProfiles.InvestigatorId = ${investigator.id} AND IaInvestigatorProfiles.AccountToken = '${token}';`;
    console.log(queryString.slice(0, 100));
    await pool.query(queryString);

    queryString = `INSERT INTO IaInvestigatorProfileImages(InvestigatorId,AccountToken,Data) VALUES (${investigator.id},'${token}','${investigator.profile.image}') ON CONFLICT (InvestigatorId) DO UPDATE SET Data = '${investigator.profile.image}' WHERE IaInvestigatorProfileImages.InvestigatorId = ${investigator.id} AND IaInvestigatorProfileImages.AccountToken = '${token}';`;
    console.log(queryString.slice(0, 100));
    await pool.query(queryString);

    queryString = `INSERT INTO IaInvestigatorDetails(InvestigatorId,AccountToken,Parameter,Skills,Weapons,Equips,Money,Backstory,Memo) VALUES (${investigator.id},'${token}','${parameter}','${skills}','${weapons}','${equips}','${money}','${backstory}','${memo}') ON CONFLICT (InvestigatorId) DO UPDATE SET Parameter = '${parameter}', Skills = '${skills}', Weapons = '${weapons}', Equips = '${equips}', Money = '${money}', Backstory = '${backstory}', Memo = '${memo}' WHERE IaInvestigatorDetails.InvestigatorId = ${investigator.id} AND IaInvestigatorDetails.AccountToken = '${token}';`;
    console.log(queryString.slice(0, 100));
    await pool.query(queryString);

    queryString = `UPDATE IaInvestigators SET IsEmpty = 0 WHERE IaInvestigators.Id = ${investigator.id} AND IaInvestigators.AccountToken = '${token}'`;
    console.log(queryString.slice(0, 100));
    await pool.query(queryString);

    return toResultObject(RES_OK, { id: investigator.id });
}

async function getInvestigatorProfileImage(pool, id) {
    var queryString = `SELECT Data FROM IaInvestigatorProfileImages WHERE InvestigatorId = ${id} LIMIT 1 OFFSET 0;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);
    if (rows.length == 0) {
        return "";
    }
    var row = rows[0];
    return row.data;
}

async function saveInvestigatorProfileImage(pool, token, id, image) {
    var queryString;
    queryString = `INSERT INTO IaInvestigatorProfileImages(InvestigatorId,AccountToken,Data) VALUES (${id},'${token}','${image}') ON CONFLICT (InvestigatorId) DO UPDATE SET Data = '${image}' WHERE IaInvestigatorProfileImages.InvestigatorId = ${id} AND IaInvestigatorProfileImages.AccountToken = '${token}';`;
    console.log(queryString.slice(0, 100));
    await pool.query(queryString);

    return toResultObject(RES_OK, { id: id });
}

async function getUserInvestigators(pool, token) {
    var queryString = `SELECT IaInvestigators.Id, json_build_object('name',RTRIM(IaInvestigatorProfiles.Name), 'kana',RTRIM(IaInvestigatorProfiles.Kana), 'tag',RTRIM(IaInvestigatorProfiles.Tag), 'job',RTRIM(IaInvestigatorProfiles.Job), 'age',RTRIM(IaInvestigatorProfiles.Age), 'gender',RTRIM(IaInvestigatorProfiles.Gender), 'image', IaInvestigatorProfileImages.Data) AS Profile FROM IaInvestigators LEFT OUTER JOIN IaInvestigatorProfiles ON (IaInvestigators.Id = IaInvestigatorProfiles.InvestigatorId) LEFT OUTER JOIN IaInvestigatorProfileImages ON (IaInvestigators.Id = IaInvestigatorProfileImages.InvestigatorId) WHERE IaInvestigators.AccountToken = '${token}' ORDER BY IaInvestigatorProfiles.UpdateTimestamp DESC LIMIT 100 OFFSET 0;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);

    var investigators = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        investigators.push({
            id: row.id,
            profile: row.profile,
        });
    }

    return toResultObject(RES_OK, investigators);
}

async function getRecentlyCreatedInvestigators(pool) {
    var queryString = `SELECT IaInvestigators.Id, json_build_object('name',RTRIM(IaInvestigatorProfiles.Name), 'kana',RTRIM(IaInvestigatorProfiles.Kana), 'tag',RTRIM(IaInvestigatorProfiles.Tag), 'job',RTRIM(IaInvestigatorProfiles.Job), 'age',RTRIM(IaInvestigatorProfiles.Age), 'gender',RTRIM(IaInvestigatorProfiles.Gender), 'image', IaInvestigatorProfileImages.Data) AS Profile FROM IaInvestigators LEFT OUTER JOIN IaInvestigatorProfiles ON (IaInvestigators.Id = IaInvestigatorProfiles.InvestigatorId) LEFT OUTER JOIN IaInvestigatorProfileImages ON (IaInvestigators.Id = IaInvestigatorProfileImages.InvestigatorId) WHERE IaInvestigators.IsEmpty = 0 ORDER BY IaInvestigatorProfiles.CreateTimestamp DESC LIMIT 10 OFFSET 0;`;
    console.log(queryString);
    var result = await pool.query(queryString);
    var rows = await GetRows(result);

    var investigators = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        investigators.push({
            id: row.id,
            profile: row.profile,
        });
    }

    return toResultObject(RES_OK, investigators);
}
