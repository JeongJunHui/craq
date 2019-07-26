var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const multer = require('multer');
//const storage = multer.memoryStorage();
const path = require("path");
const serverlog = require('./serverlog.js');
let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        callback(null, "upload/")
    },
    filename: function(req, file, callback){
        callback(null, new Date().valueOf() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

/**
 * @swagger
 * definitions:
 *   userInfo:
 *     type: object
 *     properties:
 *       pk:
 *         type: integer
 *         description: user's id
 *       Permission:
 *         type: integer
 *         description: user's permission (0 일반 , 1 관리자)
 *       email:
 *         type: string
 *         description: user's email(unique)
 *       username:
 *         type: string
 *         description: user's name(unique)
 *       password:
 *         type: string
 *         description: user's password (암호화해서 저장)
 *       last_login:
 *         type: timestamp
 *         description: user's last login time
 *       createdUser:
 *         type: integer
 *         description: id of user who create the information
 *       updatedUser:
 *         type: integer
 *         description: id of user who update the information
 *       is_public:
 *         type: integer
 *         description: visibilty check
 *       is_active:
 *         type: integer
 *         description: activity check
 *       is_removed:
 *         type: integer
 *         description: remove check
 *       ip_address:
 *         type: string
 *         description: user's ip
 *       info:
 *         type: string
 *         description: information or detailed description
 *   user pofile Info:
 *     type: object
 *     properties:
 *       User:
 *         type: integer
 *         description: user's id
 *       profile_image:
 *         type: string
 *         description: user's profile image (경로)
 *       ssafy_years:
 *         type: integer
 *         description: user's ssafy year
 *       is_major:
 *         type: boolean
 *         description: user's major check
 *       region:
 *         type: string
 *         description: user's region
 *       grade:
 *         type: string
 *         description: user's SW grade
 *       intro:
 *         type: string
 *         description: user's intro
 *       gitUrl:
 *         type: string
 *         description: user's gitUrl
 *       createdUser:
 *         type: integer
 *         description: id of user who create the information
 *       updatedUser:
 *         type: integer
 *         description: id of user who update the information
 *       is_public:
 *         type: integer
 *         description: visibilty check
 *       is_active:
 *         type: integer
 *         description: activity check
 *       is_removed:
 *         type: integer
 *         description: remove check
 *       ip_address:
 *         type: string
 *         description: user's ip
 *       info:
 *         type: string
 *         description: information or detailed description
 */

const initializeEndpoints = (app)=>{
  /**
   * @swagger
   *  /users:
   *    get:
   *      tags:
   *      - users
   *      description: 모든 회원정보를 가져온다.
   *      responses:
   *       200:
   */
  app.get('/users', function(req,res){
      var sql = " SELECT * FROM user ";
      var ip = req.headers['x-forwarded-for'] ||
              req.connection.remoteAddress ||
              req.socket.remoteAddress ||
              req.connection.socket.remoteAddress;
      console.log(ip);
      connection.query(sql, function(err, rows, fields) {
              if (!err){
                res.json(rows);
                serverlog.log(connection,0,this.sql,"success",ip);
              }
              else{
                console.log('Error while performing Query.', err);
                res.send(err);
              }
            });
    }
);
/**
 * @swagger
 *  /email-checking/{email}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 이메일의 중복 체크
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         description: |
 *          사용자 이메일 전달
 */
app.get('/email-checking/:email', function(req,res){
    var sql = " select count(*) as checking from user where email like ? ";
    var params = [req.params.email];
    connection.query(sql,params, function(err, rows, fields) {
      console.log(this.sql);
            if (!err){
              if(rows[0].checking == 0){
                res.send({status: "success"});
              }else{
                res.send({status: "fail"});
              }
            }
            else{
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
  }
);
/**
 * @swagger
 *  /username-checking/{username}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 이름 중복 체크
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: username
 *         type: string
 *         description: |
 *          사용자 이름 전달
 */
app.get('/username-checking/:username', function(req,res){
    var sql = " select count(*) as checking from user where username like ? ";
    var params = [req.params.username];
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              if(rows[0].checking == 0){
                res.send({status: "success"});
              }else{
                res.send({status: "fail"});
              }
            }
            else{
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
  }
);


/**
 * @swagger
 *  /users/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 유저의 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 */
app.get('/users/:pk', function(req,res){
    var sql = " SELECT * FROM user WHERE pk = ? ";
    var params = [req.params.pk];
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              // console.log('The solution is: ', rows);
              // return callback(null,rows);
              res.json(rows);
            }
            else{
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
  }
);

/**
 * @swagger
 *  /users/email/{email}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 유저의 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: email
 *         type: String
 *         description: |
 *          사용자 이메일 전달
 */
app.get('/users/email/:email', function(req,res){
    var sql = " SELECT * FROM user WHERE email like ? ";
    var params = [req.params.email];
    console.log(sql);
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              console.log('The solution is: ', rows);
              // return callback(null,rows);
              res.json(rows);
            }
            else{
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
  }
);

  /**
   * @swagger
   *  /users:
   *    post:
   *      tags:
   *      - users
   *      description: 회원 가입. <br><br>  중복체크 <br> - This email is already in use.
   *      responses:
   *       200:
   *      parameters:
   *       - in: body
   *         name: user
   *         description: user_info
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *             username:
   *               type: string
   *             password:
   *               type: string
   */
  app.post('/users', function(req,res){
      console.log(req.body);
      if(req.body.email == null){
        res.status(200).send({status: "fail", error:' already used.'});
      }
      var usedcheck = " select count(*) as usedcheck from user where email like ? or username like ?";
      var checkparams = [req.body.email, req.body.username];
      connection.query(usedcheck,checkparams, function(err, rows, fields) {
              if (err){
                res.send(err);
              }
              else if(rows[0].usedcheck != 0){
                res.status(200).send({status: "fail", error:' already used.'});
              }else{
                var sql = " insert into user(email, username, password) values(?,?,?) ";
                var params = [req.body.email,req.body.username,req.body.password,req.body.status,req.body.profile,req.body.git_address];
                connection.query(sql,params, function(err, rows, fields) {
                        if (!err){
                            //user profile
                          sql = " insert into profile(User) values(?) ";
                          params = [rows.insertId];
                          connection.query(sql,params, function(err, rows, fields){});
                          res.send({status: "success"});
                        }
                        else{
                          console.log('Error while performing Query.', err);
                          res.send(err);
                        }
                      });
                
              }
            });
    }
  );
  /**
   * @swagger
   *  /login:
   *    post:
   *      tags:
   *      - users
   *      description: 로그인
   *      responses:
   *       200:
   *      parameters:
   *       - in: body
   *         name: user
   *         description: user_info
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *             password:
   *               type: string
   */
  app.post('/login', function(req,res){
      console.log(req.body);
      var sql = " select count(*) as checking, pk, username from user where email = ? and password = ? and is_removed = 0 ";
      var params = [req.body.email,req.body.password];
      connection.query(sql,params, function(err, rows, fields) {
              if (!err){
                console.log(JSON.stringify(rows[0].checking));
                if(rows[0].checking == 1){
                  var loginsql = " UPDATE user SET last_login = now() WHERE pk = ?";
                  var loginparams = [rows[0].pk];
                  connection.query(loginsql,loginparams, function(err, rows, fields) {
                          if (!err){
                            console.log("last-login success");
                          }
                          else{
                            console.log('Error while performing Query.', err);
                            res.send(err);
                          }
                        });
              
                  let token = jwt.sign({
                    pk : rows[0].pk
                  },
                  secretObj.secret ,
                  {
                    expiresIn: '10000m'
                  })

                  console.log("ok");
                  res.cookie("jwt",token);
                  res.send({status:"success", jwt: token,pk: rows[0].pk, username: rows[0].username });
                }else{
                  console.log("fail");
                  res.send({status: "fail"});
                }
                // res.json(rows);
              }
              else{
                console.log('Error while performing Query.', err);
                res.send(err);
              }
            });
    }
  );
  /**
   * @swagger
   *  /users:
   *    delete:
   *      tags:
   *      - users
   *      description: 모든 회원정보를 가져온다.
   *      responses:
   *       200:
   */
  app.delete('/users', function(req,res){
      var sql = " UPDATE user SET is_removed = 1, updated_at = now() ";
      connection.query(sql, function(err, rows, fields) {
              if (!err){
                // console.log('The solution is: ', rows);
                // return callback(null,rows);
                res.json(rows);
              }
              else{
                console.log('Error while performing Query.', err);
                res.send(err);
              }
            });
    }
);
/**
 * @swagger
 *  /users/{pk}:
 *    delete:
 *      tags:
 *      - users
 *      description: 해당 유저의 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 */
app.delete('/users/:pk', function(req,res){
    var sql = " UPDATE user SET is_removed = 1, updated_at = now() WHERE pk = ?";
    var params = [req.params.pk];
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              // console.log('The solution is: ', rows);
              // return callback(null,rows);
              res.json(rows);
            }
            else{
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
  }
);
/**
 * @swagger
 *  /users/last-login/{pk}:
 *    put:
 *      tags:
 *      - users
 *      description: 마지막 로그인 시간 업데이트
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 아이디 전달
 */
app.put('/users/last-login/:pk', function(req,res){
    var sql = " UPDATE user SET last_login = now() WHERE pk = ?";
    var params = [req.params.pk];
    connection.query(sql,params, function(err, rows, fields) {
            if (!err){
              // console.log('The solution is: ', rows);
              // return callback(null,rows);
              res.json(rows);
            }
            else{
              console.log('Error while performing Query.', err);
              res.send(err);
            }
          });
  }
);
/**
 * @swagger
 *  /follows:
 *    post:
 *      tags:
 *      - users
 *      description: 회원 팔로우 정보 등록
 *      responses:
 *       200:
 *      parameters:
 *       - in: body
 *         name: follow
 *         description: follow
 *         schema:
 *           type: object
 *           properties:
 *             fromUser:
 *               type: integer
 *             toUser:
 *               type: integer
 *             user_token:
 *               type: string
 */
app.post('/follows', function(req,res){
  jwt.verify(req.body.user_token,  secretObj.secret, function(err, decoded) {
    if(err) res.status(401).send({error:'invalid token'});
    else{
      var usercheck = " select count(*) as checkUser from user where pk in (?,?) ";
      var params = [req.body.fromUser,req.body.toUser];
      connection.query(usercheck,params, function(err, rows, fields) {
              if (!err){
                if(rows[0].checkUser == 2){
                  var followcheck = " select count(*) as checkfollow from follow where fromUser = ? and toUser = ? ";
                  connection.query(followcheck,params, function(err, rows, fields) {
                    if(err){
                      console.log('Error while performing Query.', err);
                      res.send({status: "fail"});
                    }else if(rows[0].checkfollow == 0){
                      var sql = " insert into follow(fromUser,toUser) values(?,?) ";
                      connection.query(sql,params, function(err, rows, fields) {
                        if(!err){
                          console.log(rows);
                          res.send({status: "success"});
                        }else{
                          console.log('Error while performing Query.', err);
                          res.send({status: "fail"});
                        }
                      });
                    }else {
                      res.send({status: "fail",data: "already following"});
                    }
                  });



                }else{
                  res.send({status: "fail"});
                }
              }
              else{
                console.log('Error while performing Query.', err);
                res.send({status: "fail"});
              }
            });
    }
  });


  }
);
/**
 * @swagger
 *  /follows:
 *    delete:
 *      tags:
 *      - users
 *      description: 회원 팔로우 정보 삭제
 *      responses:
 *       200:
 *      parameters:
 *       - in: body
 *         name: follow
 *         description: follow
 *         schema:
 *           type: object
 *           properties:
 *             fromUser:
 *               type: integer
 *             toUser:
 *               type: integer
 *             user_token:
 *               type: string
 */
app.delete('/follows', function(req,res){
  jwt.verify(req.body.user_token,  secretObj.secret, function(err, decoded) {
    if(err) res.status(401).send({error:'invalid token'});
    else{
      var sql = "delete from follow where fromUser = ? and toUser = ? ";
      var params = [req.body.fromUser,req.body.toUser];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          res.send({status: "success"});
        }else{
          res.send({status: "fail"});
        }
      });
    }
  });
}
);

/**
 * @swagger
 *  /follows/{toUser}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 팔로우 인원 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: toUser
 *         type: integer
 *       - in: query
 *         name: user_token
 *         type: string
 */
app.get('/follows/:touser', function(req,res){
  jwt.verify(req.query.user_token,  secretObj.secret, function(err, decoded) {
    console.log(decoded);
    if(err) res.status(401).send({error:'invalid token'});
    else{
      var sql = "select * from follow where toUser = ? ";
      var params = [req.path.toUser];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          res.send({status: "success", data: rows});
        }else{
          res.send({status: "fail"});
        }
      });
    }
  });
}
);

/**
 * @swagger
 *  /profile:
 *    put:
 *      tags:
 *      - users
 *      description: 유저 프로필 등록, 수정
 *      responses:
 *       200:
 *      parameters:
 *       - in: query
 *         name: User
 *         type: integer
 *       - in: query
 *         name: ssafy_years
 *         type: integer
 *       - in: query
 *         name: is_major
 *         type: integer
 *       - in: query
 *         name: region
 *         type: string
 *       - in: query
 *         name: grade
 *         type: string
 *       - in: query
 *         name: intro
 *         type: string
 *       - in: query
 *         name: gitUrl
 *         type: string
 *       - in: formData
 *         name: profile_image
 *         type: file
 */
app.put('/profile', upload.single('profile_image'), function(req, res){
    console.log(req.query);
    console.log(req.file);
    var sql = "";
    var params = [];
    if(req.file){
//      console.log("파일있음 !");
      sql = " update profile set ssafy_years = ?, is_major = ?, region = ?, grade = ?, intro= ?, gitUrl = ?, profile_image = ?, updated_at = now() where User = ? ";
      params = [req.query.ssafy_years, req.query.is_major, req.query.region, req.query.grade, req.query.intro, req.query.gitUrl, req.file.filename, req.query.User];      
    }else{
//      console.log("파일없음 !");
      sql = " update profile set ssafy_years = ?, is_major = ?, region = ?, grade = ?, intro= ?, gitUrl = ?, updated_at = now() where User = ? ";
      params = [req.query.ssafy_years, req.query.is_major, req.query.region, req.query.grade, req.query.intro, req.query.gitUrl, req.query.User];

    }
    connection.query(sql, params, function(err, rows, fields) {
            if (err){
              console.log(err);
              res.send({status: "fail"});
            }else{
              res.send({status: "success"});
            }
          });
  }
);

/**
 * @swagger
 *  /users/profile-image/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 프로필 이미지를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 pk 전달
 */
app.get('/users/profile-image/:pk', function(req,res){
      var sql = " select count(*) as cheking, profile_image from profile where user = ? ";
      var params = [req.params.pk];
      connection.query(sql,params, function(err, rows, fields) {
        if (!err){
          var img = '<img src="/'+rows[0].profile_image + '">';
          res.send(img);
        }else{
          res.send({status: "fail"});
        }
      });    
}
);
/**
 * @swagger
 *  /users/profile/{pk}:
 *    get:
 *      tags:
 *      - users
 *      description: 해당 회원 프로필 정보를 가져온다.
 *      responses:
 *       200:
 *      parameters:
 *       - in: path
 *         name: pk
 *         type: integer
 *         description: |
 *          사용자 pk 전달
 */
app.get('/users/profile/:pk', function(req,res){
  var sql = " select * from profile where user = ? ";
  var params = [req.params.pk];
  connection.query(sql,params, function(err, rows, fields) {
    if (!err){
      res.send(rows);
    }else{
      res.send({status: "fail"});
    }
  });    
}
);

/**
 * @swagger
 *  /uploadtest:
 *    post:
 *      tags:
 *      - users
 *      description: 회원 가입. <br><br>  중복체크 <br> - This email is already in use.
 *      responses:
 *       200:
 *      parameters:
 *       - in: formData
 *         name: upfile1
 *         type: file
 */
app.post('/uploadtest', upload.single('upfile1'), function(req, res){
  res.send('Uploaded! : '+req.file.originalname); // object를 리턴함
  console.log(req.file.originalname); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.

});



};



module.exports = initializeEndpoints;
