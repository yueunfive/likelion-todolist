const express = require("express");
const app = express();

const path = require("path");

app.use(express.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

require("dotenv").config();

app.use(express.json());
var cors = require("cors");
app.use(cors());

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const { ObjectId } = require("mongodb"); // ObjectId 가져오기

var db;

// env 파일을 적용하는 server.js 코드
MongoClient.connect(
  process.env.DB_URL,
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) return console.log(err);
    db = client.db("todoapp");
    app.listen(process.env.PORT, function () {
      console.log(`listening on ${process.env.PORT}`);
    });
  }
);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build"));
});

// 회원가입
app.post("/api/users/sign-up", function (req, res) {
  console.log(req.body);
  db.collection("login").findOne(
    { id: req.body.username },
    function (err, result) {
      if (result == null) {
        db.collection("login").insertOne(
          {
            id: req.body.username,
            pw: req.body.password,
          },
          function (err, result) {
            res
              .status(200)
              .send({ message: "회원가입 요청이 성공적으로 처리되었습니다." });
          }
        );
      } else {
        res.status(400).send({
          message: "항목을 보내지 않았거나, 이미 존재하는 정보입니다.",
        });
      }
    }
  );
});

// 로그인(에러 컨트롤 보류 -> DB에 유저 정보 없을시 자동으로 401 뜸)
app.post(
  "/api/users/log-in",
  passport.authenticate("local", {
    failureFlash: true, // 실패 시 flash 메시지 사용
  }),
  function (req, res) {
    db.collection("login").findOne(
      { id: req.body.username },
      function (err, result) {
        res.status(200).send({
          userId: req.user._id,
        }); // Passport는 사용자 정보를 req.user에 저장
        console.log(req.user);
      }
    );
  }
);

// 아이디/비번 검증하는 세부 코드
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: true,
      passReqToCallback: false,
    },
    // 아이디/비번 맞는지 DB와 비교
    function (username, password, done) {
      //console.log(입력한아이디, 입력한비번);
      db.collection("login").findOne({ id: username }, function (err, result) {
        // 500
        if (err) return done(err);
        // 400
        if (!result)
          return done(null, false, {
            status: 404,
            message: "존재하지않는 아이디입니다.",
          });
        if (password == result.pw) {
          return done(null, result);
        } else {
          return done(null, false, {
            status: 401,
            message: "비밀번호 틀렸습니다.",
          });
        }
      });
    }
  )
);

// 세션 생성 -> 세션아이디 발급 -> 쿠키로 보내주기
// id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// 로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는 역할
passport.deserializeUser(function (sessionId, done) {
  db.collection("login").findOne({ id: sessionId }, function (err, result) {
    done(null, result);
  });
});

// 일정 작성
app.post("/api/plans/:user_id", function (req, res) {
  console.log(req.params.user_id);
  db.collection("login").findOne(
    { _id: ObjectId(req.params.user_id) },

    function (err, result) {
      if (!result) {
        res.status(404).send({
          detail: "유저를 찾을 수 없습니다.",
        });
      }
      let username = result.id;
      db.collection("counter").findOne(
        { name: "postNum" },
        function (err, result) {
          let totalPostNum = result.totalPost;
          let saveData = {
            _id: totalPostNum + 1,
            user: username,
            date: req.body.date,
            content: req.body.content,
            is_checked: false, // 추후 반영
            emoji: "", // 추후 반영
          };
          db.collection("post").insertOne(saveData, function () {
            db.collection("counter").updateOne(
              { name: "postNum" }, // 어떤 데이터를 수정할지
              { $inc: { totalPost: 1 } }, // 수정값(이렇게 바꿔줘)
              function (err, result) {
                if (err) {
                  return console.log(err);
                }
              }
            );
          });
          res.status(200).send(saveData);
        }
      );
    }
  );
});

// 일정 받아오기
app.get("/api/plans/:user_id", function (req, res) {
  db.collection("login").findOne(
    { _id: ObjectId(req.params.user_id) },
    function (err, result) {
      const username = result.id;
      const month = req.query.month; // month 파라미터 값 가져오기
      const day = req.query.day; // day 파라미터 값 가져오기
      const formattedMonth = String(month).padStart(2, "0"); // 두 자릿수로 맞춤
      const formattedDay = String(day).padStart(2, "0"); // 두 자릿수로 맞춤
      const formattedDate = `2023-${formattedMonth}-${formattedDay}`;

      db.collection("post")
        .find({
          user: username,
          date: formattedDate,
        })
        .toArray(function (err, result) {
          console.log(result);
          res.status(200).json(result);
        });
    }
  );
});

// 일정 수정
app.patch("/api/plans/:user_id/:plan_id", function (req, res) {
  db.collection("login").findOne(
    { _id: ObjectId(req.params.user_id) },
    function (err, result) {
      if (result) {
        console.log(result);
        // 폼에 담긴 데이터(제목, 날짜)를 가지고 db.collection에다가 업데이트
        db.collection("post").updateOne(
          { _id: parseInt(req.params.plan_id), user: result.id },
          { $set: { content: req.body.content } },
          function (err, result) {
            db.collection("post").findOne(
              { _id: parseInt(req.params.plan_id) },
              function (err, result) {
                if (!result) {
                  res.status(404).send({ detail: "일정을 찾을 수 없습니다." });
                } else {
                  console.log(result);
                  res.status(200).json(result);
                }
              }
            );
          }
        );
      }
    }
  );
});

// 일정 삭제
app.delete("/api/plans/:user_id/:plan_id", function (req, res) {
  // 사용자 조회
  db.collection("login").findOne(
    { _id: ObjectId(req.params.user_id) },
    function (err, result) {
      // 일정 삭제
      db.collection("post").deleteOne(
        { _id: parseInt(req.params.plan_id), user: result.id },
        function (err, result) {
          if (result.deletedCount === 0) {
            return res
              .status(404)
              .send({ message: "일정을 찾을 수 없습니다." });
          }
          res.status(200).send({ message: "삭제 성공" });
        }
      );
    }
  );
});

// 일정 완료(체크)
app.patch("/api/plans/:user_id/:plan_id/check", function (req, res) {
  db.collection("login").findOne(
    { _id: ObjectId(req.params.user_id) },
    function (err, result) {
      if (result) {
        // 폼에 담긴 데이터(제목, 날짜)를 가지고 db.collection에다가 업데이트
        db.collection("post").updateOne(
          { _id: parseInt(req.params.plan_id), user: result.id },
          { $set: { is_checked: req.body.is_checked } },
          function (err, result) {
            db.collection("post").findOne(
              { _id: parseInt(req.params.plan_id) },
              function (err, result) {
                if (!result) {
                  res.status(404).send({ detail: "일정을 찾을 수 없습니다." });
                } else {
                  console.log(result);
                  res.status(200).json(result);
                }
              }
            );
          }
        );
      }
    }
  );
});

// 일정후기(이모지)
app.patch("/api/plans/:user_id/:plan_id/reviews", function (req, res) {
  db.collection("login").findOne(
    { _id: ObjectId(req.params.user_id) },
    function (err, result) {
      if (result) {
        // 폼에 담긴 데이터(제목, 날짜)를 가지고 db.collection에다가 업데이트
        db.collection("post").updateOne(
          { _id: parseInt(req.params.plan_id), user: result.id },
          { $set: { emoji: req.body.emoji } },
          function (err, result) {
            db.collection("post").findOne(
              { _id: parseInt(req.params.plan_id) },
              function (err, result) {
                if (!result) {
                  res.status(404).send({ detail: "일정을 찾을 수 없습니다." });
                } else {
                  console.log(result);
                  res.status(200).json(result);
                }
              }
            );
          }
        );
      }
    }
  );
});

// 고객이 URL란에 아무거나 입력하면 걍 리액트 프로젝트나 보내주셈 -> 리액트 라우팅
// 원래 브라우저 URL창에 때려박는건 서버에게 요청하는거지 리액트 라우터에게 라우팅 요청하는게 아니기 때문에 이 코드 필요
// 이 코드는 항상 가장 하단에 놓아야 잘됩니다.
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
